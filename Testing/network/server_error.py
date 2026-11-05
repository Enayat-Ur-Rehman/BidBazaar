"""
NETWORK TEST 2: SERVER ERROR

The /auctions page asks the backend for the list of auctions
(GET /api/v1/auctionitem/allitems). Playwright catches that request and
answers it with a FAKE "500 Internal Server Error", as if the backend had
crashed. The page must handle it calmly: no crash, no JavaScript errors,
the heading is still shown, plus a friendly "No auctions found" message.

  TC-N2  fake reply HTTP 500  -> page still works, "No auctions found", no JS errors
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # lets "python this_file.py" find helpers.py

import json

from playwright.sync_api import Page, Route, expect

from helpers import snap, PAUSE_MS
from shared_config import FRONTEND_URL

ALL_ITEMS = "**/api/v1/auctionitem/allitems"   # the request we want to catch (** = any start)


def test_auctions_page_when_server_errors(page: Page):
    # Listen for JavaScript crashes on the page and collect them in a list.
    page_errors = []
    page.on("pageerror", lambda err: page_errors.append(str(err)))

    def reply_with_server_error(route: Route):
        """Called by Playwright every time the page sends the request above."""
        print(f"\n  > intercepted : GET {route.request.url}")
        print("      fake reply : 500 Internal Server Error")
        route.fulfill(status=500, content_type="application/json",
                      body=json.dumps({"success": False, "message": "Internal Server Error"}))   # fake error

    # Step 1: turn on the fake BEFORE opening the page, then open /auctions.
    page.route(ALL_ITEMS, reply_with_server_error)
    page.goto(f"{FRONTEND_URL}/auctions", wait_until="domcontentloaded")

    # Step 2: the page still shows its heading and a friendly empty message.
    expect(page.get_by_text("Live Auctions").first).to_be_visible(timeout=15_000)
    expect(page.get_by_text("No auctions found")).to_be_visible(timeout=15_000)
    snap(page, "server error handled")
    # Step 3: no JavaScript crashes happened.
    assert not page_errors, f"The page threw JavaScript errors on a 500 response: {page_errors}"
    print("      page shows : heading + \"No auctions found\", no JS errors  -> PASS")
    page.wait_for_timeout(PAUSE_MS)


if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
