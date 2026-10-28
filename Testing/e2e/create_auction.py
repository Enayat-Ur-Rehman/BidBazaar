"""
FEATURE 3 — Create Auction (E2E, Auctioneer, real /create-auction form).

  TC-C1 (positive) all valid fields + image -> "Auction item created" toast
  TC-C2 (negative) Auctioneer already has an active auction -> "You already have one active auction."
  TC-C3 (negative) Auctioneer owes unpaid commission -> warning shown, Create button disabled
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
    set_unpaid_commission(AUCTIONEER["email"], 0)
    login_via_ui(page, AUCTIONEER["email"], AUCTIONEER["password"], "**/view-my-auctions")
    delete_active_auctions(page.request)
    yield page
    set_unpaid_commission(AUCTIONEER["email"], 0)
    delete_active_auctions(page.request)


def open_create_auction(page: Page):
    page.goto(f"{FRONTEND_URL}/create-auction")
    expect(page.get_by_role("heading", name="Create New Auction")).to_be_visible(timeout=15_000)


def test_create_auction_with_valid_data_succeeds(auctioneer_page: Page):
    page = auctioneer_page
    open_create_auction(page)
    start = datetime.now() + timedelta(minutes=5)
    fill_create_auction_form(page, f"E2E Gold Watch {int(time.time())}", 5000, start, start + timedelta(days=2))

    submit = page.get_by_role("button", name="Create Auction")
    expect(submit).to_be_enabled()
    submit.click()

    expect_toast(page, "Auction item created", timeout=60_000)
    snap(page, "auction created")
    page.wait_for_timeout(PAUSE_MS)


def test_create_second_auction_while_one_is_active_is_rejected(auctioneer_page: Page):
    page = auctioneer_page
    r = api_create_auction(page.request, f"Already Active {int(time.time())}")
    assert r.status == 201, f"Seeding the first auction failed: {r.status} {r.text()}"

    open_create_auction(page)
    start = datetime.now() + timedelta(minutes=5)
    fill_create_auction_form(page, "Second Auction Attempt", 1000, start, start + timedelta(days=2))
    page.get_by_role("button", name="Create Auction").click()

    expect_toast(page, "already have one active auction")
    snap(page, "one active auction error")
    page.wait_for_timeout(PAUSE_MS)


def test_create_auction_blocked_while_commission_is_unpaid(auctioneer_page: Page):
    page = auctioneer_page
    set_unpaid_commission(AUCTIONEER["email"], 750)

    open_create_auction(page)

    expect(page.get_by_role("heading", name="Unpaid Commission")).to_be_visible(timeout=15_000)
    expect(page.get_by_role("button", name="Create Auction")).to_be_disabled()
    snap(page, "unpaid commission warning")
    page.wait_for_timeout(PAUSE_MS)

if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
