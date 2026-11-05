"""
FEATURE 4: PLACE BID

A Bidder opens a live auction page and places bids. The minimum bid is Rs. 1,000.

  TC-B1 (negative, boundary) bid Rs. 999 (1 below minimum)  -> error message, Bid button disabled
  TC-B2 (positive)           bid Rs. 1,100                  -> shown as the "Current Bid"
  TC-B3 (positive)           same bidder bids again         -> the old bid is UPDATED, not copied
                             (we check this with an API call: only 1 bid exists)

Setup: one auction is created through the API before the tests start
(once per browser), so each browser bids on its own fresh auction.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # lets "python this_file.py" find helpers.py

import time

import pytest
from playwright.sync_api import Page, Playwright, expect

from helpers import (snap, login_via_ui, expect_toast, api_login, api_create_auction, delete_active_auctions, set_unpaid_commission,
                     CAR_IMAGE, PAUSE_MS)
from shared_config import FRONTEND_URL, BACKEND_API, AUCTIONEER_FOR_INTEGRATION_TEST as AUCTIONEER, BIDDER

STARTING_BID = 1000


@pytest.fixture(scope="module")
def auction_id(playwright: Playwright, browser_name):
    """Runs ONCE for this file (per browser): creates a live auction and gives its id
    to the 3 tests. When all 3 tests are done, the auction is deleted."""
    set_unpaid_commission(AUCTIONEER["email"], 0)  # unpaid commission would block creating the auction
    request = playwright.request.new_context()     # an API client (no browser window)
    api_login(request, AUCTIONEER["email"], AUCTIONEER["password"])
    delete_active_auctions(request)
    r = api_create_auction(request, f"E2E Porsche 911 ({browser_name}) {int(time.time())}",
                           starting_bid=STARTING_BID, start_in_seconds=2, image=CAR_IMAGE)
    assert r.status == 201, f"Seeding the auction failed: {r.status} {r.text()}"
    created_id = r.json()["auctionItem"]["_id"]
    time.sleep(4)  # wait until its start time has passed, so it is live
    yield created_id                                # <- the 3 tests run here
    request.delete(f"{BACKEND_API}/auctionitem/delete/{created_id}")
    request.dispose()


def open_auction_as_bidder(page: Page, auction_id: str):
    """Log in as the Bidder, open the auction page, and return the bid amount box."""
    login_via_ui(page, BIDDER["email"], BIDDER["password"], "**/auctions")
    page.goto(f"{FRONTEND_URL}/auction/item/{auction_id}")
    bid_input = page.get_by_placeholder("Enter custom amount")
    expect(bid_input).to_be_visible(timeout=15_000)
    return bid_input


def test_bid_below_minimum_shows_inline_error(page: Page, auction_id):
    # Step 1: type 999, one rupee under the minimum (a "boundary value").
    bid_input = open_auction_as_bidder(page, auction_id)
    bid_input.fill(str(STARTING_BID - 1))  # boundary: one rupee under the minimum

    # Step 2: try to click Bid, like a user would. force=True clicks even a
    #         disabled button: correct code -> nothing happens; with a bug -> the bid is placed.
    page.get_by_role("button", name="Bid", exact=True).click(force=True)
    page.wait_for_timeout(PAUSE_MS)
    snap(page, "after clicking Bid with 999")

    # Step 3: no bid may appear in Live Bidding ...
    expect(page.get_by_text("No bids yet"), "A bid below the minimum was placed!").to_be_visible()

    # Step 4: ... an error is shown under the box, the Bid button is disabled,
    #         and an error pop-up appears.
    expect(page.get_by_text("Minimum bid is Rs.").first).to_be_visible()
    expect(page.get_by_role("button", name="Bid", exact=True)).to_be_disabled()
    expect_toast(page, "Minimum bid is Rs.")
    snap(page, "minimum bid error")
    page.wait_for_timeout(PAUSE_MS)


def test_valid_bid_is_accepted_and_shown_as_current_bid(page: Page, auction_id):
    # Step 1: bid Rs. 1,100 and click Bid.
    bid_input = open_auction_as_bidder(page, auction_id)
    bid_input.fill(str(STARTING_BID + 100))
    page.get_by_role("button", name="Bid", exact=True).click()

    # Step 2: the page shows "Current Bid: Rs. 1,100".
    expect(page.get_by_text("Current Bid:")).to_be_visible(timeout=15_000)
    expect(page.get_by_text(f"Rs. {STARTING_BID + 100:,}").first).to_be_visible(timeout=15_000)
    snap(page, "bid accepted")
    page.wait_for_timeout(PAUSE_MS)


def test_rebid_by_same_bidder_updates_existing_bid_not_a_new_one(page: Page, auction_id):
    bid_input = open_auction_as_bidder(page, auction_id)

    # Step 1: first bid Rs. 1,200.
    bid_input.fill(str(STARTING_BID + 200))
    page.get_by_role("button", name="Bid", exact=True).click()
    expect(page.get_by_text(f"Rs. {STARTING_BID + 200:,}").first).to_be_visible(timeout=15_000)
    snap(page, "first bid 1200")

    # Step 2: the same bidder bids again, Rs. 1,300.
    bid_input.fill(str(STARTING_BID + 300))
    page.get_by_role("button", name="Bid", exact=True).click()
    expect(page.get_by_text(f"Rs. {STARTING_BID + 300:,}").first).to_be_visible(timeout=15_000)
    snap(page, "rebid 1300")
    page.wait_for_timeout(PAUSE_MS)

    # Step 3: ask the backend for "my bids" (using the browser's login) and check
    #         there is only ONE bid on this auction, i.e. it was updated, not duplicated.
    r = page.request.get(f"{BACKEND_API}/bid/myBids")
    bids_here = [b for b in r.json()["bids"] if b["auctionItem"]["_id"] == auction_id]
    assert len(bids_here) == 1, f"Re-bidding must update the existing bid, found {len(bids_here)} bids."

if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
