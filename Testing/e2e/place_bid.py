"""
FEATURE 4 — Place Bid (E2E, Bidder, real /auction/item/:id page).

  TC-B1 (negative, boundary value) bid 1 below the minimum -> error popup + inline error, Bid button disabled
  TC-B2 (positive) valid bid above the minimum -> shown as the Current Bid
  TC-B3 (positive, state transition) same bidder raises their bid -> existing bid UPDATED,
                   not duplicated (verified via API)

The auction being bid on is seeded once per browser through the real
Create Auction API (setup only), so every browser gets a fresh one.
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
    set_unpaid_commission(AUCTIONEER["email"], 0)  # unpaid commission would block creating the auction
    request = playwright.request.new_context()
    api_login(request, AUCTIONEER["email"], AUCTIONEER["password"])
    delete_active_auctions(request)
    r = api_create_auction(request, f"E2E Porsche 911 ({browser_name}) {int(time.time())}",
                           starting_bid=STARTING_BID, start_in_seconds=2, image=CAR_IMAGE)
    assert r.status == 201, f"Seeding the auction failed: {r.status} {r.text()}"
    created_id = r.json()["auctionItem"]["_id"]
    time.sleep(4)  # wait until its start time has passed, so it is live
    yield created_id
    request.delete(f"{BACKEND_API}/auctionitem/delete/{created_id}")
    request.dispose()


def open_auction_as_bidder(page: Page, auction_id: str):
    login_via_ui(page, BIDDER["email"], BIDDER["password"], "**/auctions")
    page.goto(f"{FRONTEND_URL}/auction/item/{auction_id}")
    bid_input = page.get_by_placeholder("Enter custom amount")
    expect(bid_input).to_be_visible(timeout=15_000)
    return bid_input


def test_bid_below_minimum_shows_inline_error(page: Page, auction_id):
    bid_input = open_auction_as_bidder(page, auction_id)
    bid_input.fill(str(STARTING_BID - 1))  # boundary: one rupee under the minimum

    expect(page.get_by_text("Minimum bid is Rs.").first).to_be_visible()
    expect(page.get_by_role("button", name="Bid", exact=True)).to_be_disabled()
    expect_toast(page, "Minimum bid is Rs.")
    snap(page, "minimum bid error")
    page.wait_for_timeout(PAUSE_MS)


def test_valid_bid_is_accepted_and_shown_as_current_bid(page: Page, auction_id):
    bid_input = open_auction_as_bidder(page, auction_id)
    bid_input.fill(str(STARTING_BID + 100))
    page.get_by_role("button", name="Bid", exact=True).click()

    expect(page.get_by_text("Current Bid:")).to_be_visible(timeout=15_000)
    expect(page.get_by_text(f"Rs. {STARTING_BID + 100:,}").first).to_be_visible(timeout=15_000)
    snap(page, "bid accepted")
    page.wait_for_timeout(PAUSE_MS)


def test_rebid_by_same_bidder_updates_existing_bid_not_a_new_one(page: Page, auction_id):
    bid_input = open_auction_as_bidder(page, auction_id)

    bid_input.fill(str(STARTING_BID + 200))
    page.get_by_role("button", name="Bid", exact=True).click()
    expect(page.get_by_text(f"Rs. {STARTING_BID + 200:,}").first).to_be_visible(timeout=15_000)
    snap(page, "first bid 1200")

    bid_input.fill(str(STARTING_BID + 300))
    page.get_by_role("button", name="Bid", exact=True).click()
    expect(page.get_by_text(f"Rs. {STARTING_BID + 300:,}").first).to_be_visible(timeout=15_000)
    snap(page, "rebid 1300")
    page.wait_for_timeout(PAUSE_MS)

    r = page.request.get(f"{BACKEND_API}/bid/myBids")
    bids_here = [b for b in r.json()["bids"] if b["auctionItem"]["_id"] == auction_id]
    assert len(bids_here) == 1, f"Re-bidding must update the existing bid, found {len(bids_here)} bids."

if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
