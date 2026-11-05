"""
FEATURE 3: CREATE AUCTION

An Auctioneer logs in and uses the real Create Auction form.

  TC-C1 (positive) all fields filled + an image          -> "Auction item created" message
  TC-C2 (negative) Auctioneer already has a live auction -> "You already have one active auction."
  TC-C3 (negative) Auctioneer still owes commission      -> warning shown, Create button is disabled
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # lets "python this_file.py" find helpers.py

import time
from datetime import datetime, timedelta

import pytest
from playwright.sync_api import Page, expect

from helpers import (snap, login_via_ui, expect_toast, fill_create_auction_form, api_create_auction,
                     delete_active_auctions, set_unpaid_commission, PAUSE_MS)
from shared_config import FRONTEND_URL, AUCTIONEER_FOR_SYSTEM_TEST as AUCTIONEER


@pytest.fixture
def auctioneer_page(page: Page):
    """Before each test: log in as the Auctioneer with a clean account.
    After each test: clean up again."""
    set_unpaid_commission(AUCTIONEER["email"], 0)   # no commission owed
    login_via_ui(page, AUCTIONEER["email"], AUCTIONEER["password"], "**/view-my-auctions")
    delete_active_auctions(page.request)            # no auctions left over from earlier runs
    yield page                                      # <- the test runs here
    set_unpaid_commission(AUCTIONEER["email"], 0)
    delete_active_auctions(page.request)


def open_create_auction(page: Page):
    """Go to the Create Auction page and wait until its heading is shown."""
    page.goto(f"{FRONTEND_URL}/create-auction")
    expect(page.get_by_role("heading", name="Create New Auction")).to_be_visible(timeout=15_000)


def test_create_auction_with_valid_data_succeeds(auctioneer_page: Page):
    page = auctioneer_page
    # Step 1: open the form and fill every field (title, price, dates, image ...).
    open_create_auction(page)
    start = datetime.now() + timedelta(minutes=5)
    fill_create_auction_form(page, f"E2E Gold Watch {int(time.time())}", 5000, start, start + timedelta(days=2))

    # Step 2: the Create button must be clickable; click it.
    submit = page.get_by_role("button", name="Create Auction")
    expect(submit).to_be_enabled()
    submit.click()

    # Step 3: the success message appears (the image upload can be slow, so wait up to 60 s).
    expect_toast(page, "Auction item created", timeout=60_000)
    snap(page, "auction created")
    page.wait_for_timeout(PAUSE_MS)


def test_create_second_auction_while_one_is_active_is_rejected(auctioneer_page: Page):
    page = auctioneer_page
    # Setup: quickly create one auction through the API, so one is already live.
    r = api_create_auction(page.request, f"Already Active {int(time.time())}")
    assert r.status == 201, f"Seeding the first auction failed: {r.status} {r.text()}"

    # Step 1: try to create a second one through the form.
    open_create_auction(page)
    start = datetime.now() + timedelta(minutes=5)
    fill_create_auction_form(page, "Second Auction Attempt", 1000, start, start + timedelta(days=2))
    page.get_by_role("button", name="Create Auction").click()

    # Step 2: the app must refuse it with an error message.
    expect_toast(page, "already have one active auction")
    snap(page, "one active auction error")
    page.wait_for_timeout(PAUSE_MS)


def test_create_auction_blocked_while_commission_is_unpaid(auctioneer_page: Page):
    page = auctioneer_page
    # Setup: pretend the Auctioneer owes Rs. 750 commission (set directly in the database).
    set_unpaid_commission(AUCTIONEER["email"], 750)

    # Step 1: open the Create Auction page.
    open_create_auction(page)

    # Step 2: a warning is shown and the Create button cannot be clicked.
    expect(page.get_by_role("heading", name="Unpaid Commission")).to_be_visible(timeout=15_000)
    expect(page.get_by_role("button", name="Create Auction")).to_be_disabled()
    snap(page, "unpaid commission warning")
    page.wait_for_timeout(PAUSE_MS)

if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
