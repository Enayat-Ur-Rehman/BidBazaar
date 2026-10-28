"""
NETWORK MOCKING TEST 1 — EMPTY DATA

page.route() catches the browser's call to GET /api/v1/auctionitem/allitems
and answers it with a fake "200 OK, no auctions" response, so the real
backend is never asked. The /auctions page must show its empty state,
even though the real database does contain auctions.

  TC-N1  mocked 200 with items: []  -> "No auctions found" empty state
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # lets "python this_file.py" find helpers.py

import json

from playwright.sync_api import Page, Route, expect

from helpers import snap, PAUSE_MS
from shared_config import FRONTEND_URL

ALL_ITEMS = "**/api/v1/auctionitem/allitems"


def test_auctions_page_with_empty_data(page: Page):
    intercepted = []

    def reply_with_empty_list(route: Route):
        intercepted.append(route.request.url)
        print(f"\n  > intercepted : GET {route.request.url}")
        print("      fake reply : 200 OK  {\"success\": true, \"items\": []}")
        route.fulfill(status=200, content_type="application/json",
                      body=json.dumps({"success": True, "items": []}))

    page.route(ALL_ITEMS, reply_with_empty_list)
    page.goto(f"{FRONTEND_URL}/auctions", wait_until="domcontentloaded")

    expect(page.get_by_text("No auctions found")).to_be_visible(timeout=15_000)
    expect(page.get_by_text("Try adjusting your filters or search query")).to_be_visible()
    snap(page, "empty state")
    assert intercepted, "The page never requested /auctionitem/allitems, so the mock was not used."
    print("      page shows : \"No auctions found\"  -> PASS")
    page.wait_for_timeout(PAUSE_MS)


if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
