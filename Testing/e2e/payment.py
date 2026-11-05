"""
FEATURE 5: PAYMENT (Stripe, test mode)

After winning, the Bidder pays a 20% deposit on the real Stripe test checkout page.

  TC-P1 (positive) Stripe test card 4242 4242 4242 4242   -> "Success!" page, database says "Paid"
  TC-P2 (negative) Stripe's "always declined" card        -> Stripe says "declined", database stays "Pending"
  TC-P3 (negative) the 12-hour payment deadline is over   -> "Payment Deadline Expired", Pay button
                   disabled, and the server also refuses to start a Stripe payment

Setup: a payment normally only appears after a won auction ends, so the
test puts a "Pending" payment straight into the database. The payment
itself is real (Stripe test mode, no real money).
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # lets "python this_file.py" find helpers.py

import re
import time
from datetime import timedelta

import pytest
from playwright.sync_api import Page, Playwright, expect

from helpers import (snap, login_via_ui, api_login, api_create_auction, register_temp_auctioneer,
                     seed_pending_payment, get_payment_status, delete_payment_and_auction,
                     delete_users_by_email_prefix, PAUSE_MS)
from shared_config import FRONTEND_URL, BACKEND_API, BIDDER

BID_AMOUNT = 5000
DEPOSIT = BID_AMOUNT * 0.2          # 20% deposit = Rs. 1,000

CARD_SUCCESS = "4242424242424242"   # https://docs.stripe.com/testing#cards
CARD_DECLINED = "4000000000000002"


@pytest.fixture
def make_payment(playwright: Playwright):
    """Gives the test a function that creates one "Pending" payment and returns its id.
    After the test, everything it created is deleted."""
    created = []
    request = playwright.request.new_context()     # an API client (no browser window)

    def _make(expires_in=timedelta(hours=1)) -> str:
        # a throw-away Auctioneer creates an auction, then a payment for it is put in the database
        auctioneer = register_temp_auctioneer(request)
        api_login(request, auctioneer["email"], auctioneer["password"])
        r = api_create_auction(request, f"Payment Test Auction {int(time.time() * 1000)}", starting_bid=BID_AMOUNT)
        assert r.status == 201, f"Seeding auction failed: {r.status} {r.text()}"
        auction_id = r.json()["auctionItem"]["_id"]
        payment_id = seed_pending_payment(auction_id, BID_AMOUNT, expires_in)
        created.append((payment_id, auction_id))
        return payment_id

    yield _make                                    # <- the test runs here
    for payment_id, auction_id in created:
        delete_payment_and_auction(payment_id, auction_id)
    delete_users_by_email_prefix("autotest_auctioneer_")
    request.dispose()


def open_checkout(page: Page, payment_id: str):
    """Log in as the Bidder and open the "Confirm Your Win" page for this payment."""
    login_via_ui(page, BIDDER["email"], BIDDER["password"], "**/auctions")
    page.goto(f"{FRONTEND_URL}/payment/{payment_id}")
    expect(page.get_by_role("heading", name="Confirm Your Win")).to_be_visible(timeout=15_000)
    expect(page.get_by_text(f"Rs. {DEPOSIT:g}").first).to_be_visible()   # the deposit amount is shown


def pay_on_stripe(page: Page, card_number: str):
    """Click Pay, wait for the Stripe page, fill in the card form and submit it."""
    page.get_by_role("button", name="Pay Rs.").click()
    page.wait_for_url("**checkout.stripe.com**", timeout=30_000)     # now on Stripe's own website
    expect(page.locator("#cardNumber")).to_be_visible(timeout=20_000)
    # Disposable email: a real address may be enrolled in Stripe Link,
    # which pops a phone-verification modal over the Pay button.
    page.locator("#email").fill(f"stripetest+{int(time.time())}@example.com")
    page.locator("#cardNumber").fill(card_number)
    page.locator("#cardExpiry").fill("12/34")
    page.locator("#cardCvc").fill("123")
    page.locator("#billingName").fill("BidBazaar Test Bidder")
    page.wait_for_timeout(PAUSE_MS)
    page.get_by_test_id("hosted-payment-submit-button").click(force=True)   # Stripe's Pay button
    try:  # dismiss Stripe's optional "Link" upsell modal if it appears
        close = page.get_by_role("button", name="close")
        close.wait_for(state="visible", timeout=4_000)
        close.click()
    except Exception:
        pass


def test_payment_with_valid_test_card_succeeds(page: Page, make_payment):
    # Step 1: create a pending payment, open it, and pay with the "good" test card.
    payment_id = make_payment()
    open_checkout(page, payment_id)
    pay_on_stripe(page, CARD_SUCCESS)

    # Step 2: Stripe sends us back to our success page.
    page.wait_for_url("**/payment/success**", timeout=45_000)
    expect(page.get_by_text("Success!")).to_be_visible(timeout=15_000)
    snap(page, "payment success")
    page.wait_for_timeout(PAUSE_MS)
    # Step 3: the database must now say "Paid".
    assert get_payment_status(payment_id) == "Paid"


def test_payment_with_declined_card_is_rejected(page: Page, make_payment):
    # Step 1: same as above, but with a card Stripe always declines.
    payment_id = make_payment()
    open_checkout(page, payment_id)
    pay_on_stripe(page, CARD_DECLINED)

    # Step 2: Stripe shows "declined" and we stay on the Stripe page.
    expect(page.get_by_text(re.compile("declined", re.I)).first).to_be_visible(timeout=30_000)
    snap(page, "card declined")
    assert "checkout.stripe.com" in page.url, "A declined card must not leave the Stripe page."
    page.wait_for_timeout(PAUSE_MS)
    # Step 3: the database must still say "Pending" (nothing was paid).
    assert get_payment_status(payment_id) == "Pending"


def test_expired_payment_cannot_be_paid(page: Page, make_payment):
    # Step 1: create a payment whose deadline was 1 hour ago, and open it.
    payment_id = make_payment(expires_in=timedelta(hours=-1))
    open_checkout(page, payment_id)

    # Step 2: the page says the deadline is over and the Pay button is disabled.
    expect(page.get_by_text("Payment Deadline Expired")).to_be_visible(timeout=15_000)
    expect(page.get_by_role("button", name="Payment Period Expired")).to_be_disabled()
    snap(page, "deadline expired")
    page.wait_for_timeout(PAUSE_MS)

    # Step 3: the server must refuse as well, not only the disabled button:
    # asking for a Stripe checkout session for this payment must fail.
    r = page.request.post(f"{BACKEND_API}/payment/stripe/createSession/{payment_id}")
    assert r.status == 400, f"Server created a Stripe session for an expired payment ({r.status})."
    assert r.json()["message"] == "Payment deadline has passed"

if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
