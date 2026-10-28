"""
FEATURE 5 — Stripe Payment of the 20% win deposit (E2E, real Stripe test-mode Checkout).

  TC-P1 (positive) pay with Stripe test card 4242 4242 4242 4242 -> success page,
                   payment is "Paid" in the database
  TC-P2 (negative) pay with Stripe's always-declined test card 4000 0000 0000 0002 ->
                   Stripe shows "declined", payment stays "Pending" in the database
  TC-P3 (negative) payment whose 12-hour deadline has passed -> "Payment Deadline Expired",
                   pay button disabled

A pending payment only exists after a won auction's cron runs, so it is
seeded in MongoDB (setup only). The payment itself is real (Stripe sandbox).
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
from shared_config import FRONTEND_URL, BIDDER

BID_AMOUNT = 5000
DEPOSIT = BID_AMOUNT * 0.2

CARD_SUCCESS = "4242424242424242"   # https://docs.stripe.com/testing#cards
CARD_DECLINED = "4000000000000002"


@pytest.fixture
def make_payment(playwright: Playwright):
    """Returns a function that seeds one pending payment and gives back its id."""
    created = []
    request = playwright.request.new_context()

    def _make(expires_in=timedelta(hours=1)) -> str:
        auctioneer = register_temp_auctioneer(request)
        api_login(request, auctioneer["email"], auctioneer["password"])
        r = api_create_auction(request, f"Payment Test Auction {int(time.time() * 1000)}", starting_bid=BID_AMOUNT)
        assert r.status == 201, f"Seeding auction failed: {r.status} {r.text()}"
        auction_id = r.json()["auctionItem"]["_id"]
        payment_id = seed_pending_payment(auction_id, BID_AMOUNT, expires_in)
        created.append((payment_id, auction_id))
        return payment_id

    yield _make
    for payment_id, auction_id in created:
        delete_payment_and_auction(payment_id, auction_id)
    delete_users_by_email_prefix("autotest_auctioneer_")
    request.dispose()


def open_checkout(page: Page, payment_id: str):
    login_via_ui(page, BIDDER["email"], BIDDER["password"], "**/auctions")
    page.goto(f"{FRONTEND_URL}/payment/{payment_id}")
    expect(page.get_by_role("heading", name="Confirm Your Win")).to_be_visible(timeout=15_000)
    expect(page.get_by_text(f"Rs. {DEPOSIT:g}").first).to_be_visible()


def pay_on_stripe(page: Page, card_number: str):
    page.get_by_role("button", name="Pay Rs.").click()
    page.wait_for_url("**checkout.stripe.com**", timeout=30_000)
    expect(page.locator("#cardNumber")).to_be_visible(timeout=20_000)
    # Disposable email: a real address may be enrolled in Stripe Link,
    # which pops a phone-verification modal over the Pay button.
    page.locator("#email").fill(f"stripetest+{int(time.time())}@example.com")
    page.locator("#cardNumber").fill(card_number)
    page.locator("#cardExpiry").fill("12/34")
    page.locator("#cardCvc").fill("123")
    page.locator("#billingName").fill("BidBazaar Test Bidder")
    page.wait_for_timeout(PAUSE_MS)
    page.get_by_test_id("hosted-payment-submit-button").click(force=True)
    try:  # dismiss Stripe's optional "Link" upsell modal if it appears
        close = page.get_by_role("button", name="close")
        close.wait_for(state="visible", timeout=4_000)
        close.click()
    except Exception:
        pass


def test_payment_with_valid_test_card_succeeds(page: Page, make_payment):
    payment_id = make_payment()
    open_checkout(page, payment_id)
    pay_on_stripe(page, CARD_SUCCESS)

    page.wait_for_url("**/payment/success**", timeout=45_000)
    expect(page.get_by_text("Success!")).to_be_visible(timeout=15_000)
    snap(page, "payment success")
    page.wait_for_timeout(PAUSE_MS)
    assert get_payment_status(payment_id) == "Paid"


def test_payment_with_declined_card_is_rejected(page: Page, make_payment):
    payment_id = make_payment()
    open_checkout(page, payment_id)
    pay_on_stripe(page, CARD_DECLINED)

    expect(page.get_by_text(re.compile("declined", re.I)).first).to_be_visible(timeout=30_000)
    snap(page, "card declined")
    assert "checkout.stripe.com" in page.url, "A declined card must not leave the Stripe page."
    page.wait_for_timeout(PAUSE_MS)
    assert get_payment_status(payment_id) == "Pending"


def test_expired_payment_cannot_be_paid(page: Page, make_payment):
    payment_id = make_payment(expires_in=timedelta(hours=-1))
    open_checkout(page, payment_id)

    expect(page.get_by_text("Payment Deadline Expired")).to_be_visible(timeout=15_000)
    expect(page.get_by_role("button", name="Payment Period Expired")).to_be_disabled()
    snap(page, "deadline expired")
    page.wait_for_timeout(PAUSE_MS)

if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
