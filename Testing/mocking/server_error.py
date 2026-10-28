"""
NETWORK MOCKING TEST 2 — SERVER ERROR

page.route() catches the browser's call to GET /api/v1/auctionitem/allitems
and answers it with a fake "500 Internal Server Error", as if the backend
had crashed. The /auctions page must handle it gracefully: no crash, no
JavaScript errors, heading still shown, friendly empty state.

  TC-N2  mocked HTTP 500  -> page still renders, "No auctions found", no JS errors
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # lets "python this_file.py" find helpers.py

import json

from playwright.sync_api import Page, Route, expect

from helpers import snap, PAUSE_MS
from shared_config import FRONTEND_URL

ALL_ITEMS = "**/api/v1/auctionitem/allitems"


def test_auctions_page_when_server_errors(page: Page):
    page_errors = []
    page.on("pageerror", lambda err: page_errors.append(str(err)))

    def reply_with_server_error(route: Route):
        print(f"\n  > intercepted : GET {route.request.url}")
        print("      fake reply : 500 Internal Server Error")
        route.fulfill(status=500, content_type="application/json",
                      body=json.dumps({"success": False, "message": "Internal Server Error"}))

    page.route(ALL_ITEMS, reply_with_server_error)
    page.goto(f"{FRONTEND_URL}/auctions", wait_until="domcontentloaded")

    expect(page.get_by_text("Live Auctions").first).to_be_visible(timeout=15_000)
    expect(page.get_by_text("No auctions found")).to_be_visible(timeout=15_000)
    snap(page, "server error handled")
    assert not page_errors, f"The page threw JavaScript errors on a 500 response: {page_errors}"
    print("      page shows : heading + \"No auctions found\", no JS errors  -> PASS")
    page.wait_for_timeout(PAUSE_MS)


if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
