"""
NETWORK TEST 1: EMPTY DATA

The /auctions page asks the backend for the list of auctions
(GET /api/v1/auctionitem/allitems). Playwright catches that request and
answers it with a FAKE reply: "200 OK, no auctions". The real backend is
never asked. The page must then show its "No auctions found" message,
even though the real database does have auctions.

  TC-N1  fake reply 200 with items: []  -> "No auctions found"
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # lets "python this_file.py" find helpers.py

import json

from playwright.sync_api import Page, Route, expect

from helpers import snap, PAUSE_MS
from shared_config import FRONTEND_URL

ALL_ITEMS = "**/api/v1/auctionitem/allitems"   # the request we want to catch (** = any start)


def test_auctions_page_with_empty_data(page: Page):
    intercepted = []   # we note every request we catch, to prove the fake was used

    def reply_with_empty_list(route: Route):
        """Called by Playwright every time the page sends the request above."""
        intercepted.append(route.request.url)
        print(f"\n  > intercepted : GET {route.request.url}")
        print("      fake reply : 200 OK  {\"success\": true, \"items\": []}")
        route.fulfill(status=200, content_type="application/json",
                      body=json.dumps({"success": True, "items": []}))   # send our fake answer

    # Step 1: turn on the fake BEFORE opening the page, then open /auctions.
    page.route(ALL_ITEMS, reply_with_empty_list)
    page.goto(f"{FRONTEND_URL}/auctions", wait_until="domcontentloaded")

    # Step 2: the page shows its empty-list message.
    expect(page.get_by_text("No auctions found")).to_be_visible(timeout=15_000)
    expect(page.get_by_text("Try adjusting your filters or search query")).to_be_visible()
    snap(page, "empty state")
    # Step 3: make sure our fake was really used.
    assert intercepted, "The page never requested /auctionitem/allitems, so the mock was not used."
    print("      page shows : \"No auctions found\"  -> PASS")
    page.wait_for_timeout(PAUSE_MS)


if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
