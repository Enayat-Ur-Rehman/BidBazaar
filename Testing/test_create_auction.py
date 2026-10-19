"""
BidBazaar - Create Auction end-to-end test (Playwright, Python)

What it does
  1. Logs in through the real Login page as an Auctioneer.
  2. Opens the Create Auction page and fills every required field
     (title, category, condition, starting bid, description,
     start/end time, image).
  3. Submits the form and checks the success toast.
  4. Confirms through the backend API that the auction really exists.

Before running
  - MongoDB is running.
  - Backend is running:   cd backend  && npm run dev   (http://localhost:5000)
  - Frontend is running:  cd frontend && npm run dev   (http://localhost:5173)

Run
  python Testing/test_create_auction.py            (opens a visible browser)
  python Testing/test_create_auction.py --headless (no browser window)

Business rules enforced by the backend (from auctionItemController.js):
  - Only users with role "Auctioneer" can create auctions.
  - The auctioneer must have no unpaid commission.
  - The auctioneer may have only ONE active auction (endTime in the future).
  - Start time must be in the future and before the end time.
  - Image is required and must be PNG, JPEG or WEBP.
Because of the "one active auction" rule, a second run would normally fail.
With CLEANUP_ACTIVE_AUCTIONS = True the test first deletes the test
account's own still-active auctions so it can be run repeatedly.
"""

import sys
import time
from datetime import datetime, timedelta
from pathlib import Path

from playwright.sync_api import Page, expect, sync_playwright

# ---------------------------------------------------------------- config
FRONTEND_URL = "http://localhost:5173"
BACKEND_API = "http://localhost:5000/api/v1"

AUCTIONEER_EMAIL = "ammar@gmail.com"
AUCTIONEER_PASSWORD = "ammar@12"

# Delete this account's own active auctions before creating a new one,
# so the "one active auction per auctioneer" rule doesn't block re-runs.
CLEANUP_ACTIVE_AUCTIONS = True

# Product photo for the auction. Kept in Testing/assets; downloaded from
# IMAGE_URL automatically if the file is missing.
IMAGE_URL = (
    "https://static.markaz.app/pakistan/products/"
    "2977-132-MZ2977200035HEOFFN-769301001-product-1.webp"
)
IMAGE_PATH = Path(__file__).resolve().parent / "assets" / "gold_watch.webp"

HEADLESS = "--headless" in sys.argv
SLOW_MO_MS = 0 if HEADLESS else 300  # slow down so you can watch it

RUN_ID = datetime.now().strftime("%Y%m%d-%H%M%S")  # used for screenshot names
AUCTION = {
    "title": "24K Gold Chronograph Watch",
    "category": "Jewelry & Watches",
    "condition": "New",
    "starting_bid": "5000",
    "description": (
        "Luxury 24K gold men's chronograph wristwatch, brand new in its box. "
        "Polished gold case with a matching gold link bracelet and fold-over "
        "clasp. Black starry sparkle dial with gold hands and luminous gold "
        "hour markers, ringed by a white crystal-set chapter ring. Three white "
        "sub-dials for the stopwatch seconds, minutes and 24-hour time, plus a "
        "date window between 4 and 5 o'clock. Gold screw-down crown with two "
        "chronograph push buttons. Quartz movement, perfect as a gift or a "
        "statement piece."
    ),
}


def ensure_image() -> None:
    """Download the product photo if it isn't in Testing/assets yet."""
    if IMAGE_PATH.exists():
        return
    import urllib.request

    step(f"Downloading product image to {IMAGE_PATH}...")
    IMAGE_PATH.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(IMAGE_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        IMAGE_PATH.write_bytes(resp.read())


def to_datetime_local(dt: datetime) -> str:
    """Format for <input type="datetime-local">: YYYY-MM-DDTHH:MM"""
    return dt.strftime("%Y-%m-%dT%H:%M")


def parse_api_date(value):
    """Parse a date from the API. Normally ISO 8601 ("2026-10-18T10:37:00.000Z");
    older records may hold JS Date strings ("Sun Oct 18 2026 15:37:00 GMT+0500 (...)").
    Returns an aware datetime, or None if it can't be parsed."""
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        pass
    try:
        head = str(value).split(" (")[0]  # drop "(Pakistan Standard Time)"
        return datetime.strptime(head, "%a %b %d %Y %H:%M:%S GMT%z")
    except ValueError:
        return None


def step(msg: str) -> None:
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")


# ---------------------------------------------------------------- steps
def check_servers_up(page: Page) -> None:
    step("Checking backend and frontend are reachable...")
    try:
        r = page.request.get(f"{BACKEND_API}/auctionitem/allitems", timeout=10_000)
        assert r.ok, f"backend returned {r.status}"
    except Exception as e:
        raise SystemExit(f"Backend not reachable at {BACKEND_API}: {e}")
    try:
        page.request.get(FRONTEND_URL, timeout=10_000)
    except Exception as e:
        raise SystemExit(f"Frontend not reachable at {FRONTEND_URL}: {e}")


def login(page: Page) -> None:
    step(f"Logging in as {AUCTIONEER_EMAIL}...")
    page.goto(f"{FRONTEND_URL}/login")
    page.get_by_placeholder("Enter your email").fill(AUCTIONEER_EMAIL)
    page.get_by_placeholder("Enter your password").fill(AUCTIONEER_PASSWORD)
    page.get_by_role("button", name="Login").click()

    # Auctioneers are redirected to /view-my-auctions after login.
    page.wait_for_url("**/view-my-auctions", timeout=15_000)
    step("Login successful, redirected to My Auctions.")


def cleanup_active_auctions(page: Page) -> None:
    """Delete the logged-in auctioneer's own auctions that are still active."""
    r = page.request.get(f"{BACKEND_API}/auctionitem/myitems")
    assert r.ok, f"Could not load my auctions: {r.status} {r.text()}"
    now = datetime.now().astimezone()
    for item in r.json().get("items", []):
        end = parse_api_date(item["endTime"])
        if end is None or end > now:
            step(f"Removing active auction '{item['title']}' (one-active-auction rule)")
            d = page.request.delete(f"{BACKEND_API}/auctionitem/delete/{item['_id']}")
            assert d.ok, f"Delete failed: {d.status} {d.text()}"


def fill_and_submit_auction(page: Page) -> None:
    step("Opening Create Auction page...")
    page.goto(f"{FRONTEND_URL}/create-auction")
    expect(page.get_by_role("heading", name="Create New Auction")).to_be_visible(
        timeout=15_000
    )

    # The page shows a red banner and disables the button if commission is unpaid.
    if page.get_by_text("Unpaid Commission").is_visible():
        raise AssertionError("Account has unpaid commission; auction creation is blocked.")

    step("Filling basic information...")
    page.get_by_placeholder("Enter auction title").fill(AUCTION["title"])

    # Selects have no <label for>, so locate them by their placeholder option.
    page.locator("select", has=page.locator("option", has_text="Select Category")) \
        .select_option(AUCTION["category"])
    page.locator("select", has=page.locator("option", has_text="Select Condition")) \
        .select_option(AUCTION["condition"])

    page.get_by_placeholder("0.00").fill(AUCTION["starting_bid"])
    page.get_by_placeholder("Provide a detailed description of your item...") \
        .fill(AUCTION["description"])

    step("Setting auction timing...")
    # Start must be in the future (server checks this at submit time),
    # so give a few minutes of margin. End is 2 days after start.
    start = datetime.now() + timedelta(minutes=5)
    end = start + timedelta(days=2)
    times = page.locator('input[type="datetime-local"]')
    times.nth(0).fill(to_datetime_local(start))
    times.nth(1).fill(to_datetime_local(end))
    expect(times.nth(0)).to_have_value(to_datetime_local(start))
    expect(times.nth(1)).to_have_value(to_datetime_local(end))

    step(f"Uploading image {IMAGE_PATH.name}...")
    assert IMAGE_PATH.exists(), f"Test image not found: {IMAGE_PATH}"
    # The file input is visually hidden; set_input_files works regardless.
    page.locator('input[type="file"]').set_input_files(str(IMAGE_PATH))
    expect(page.get_by_alt_text("Preview")).to_be_visible()

    step("Submitting the form...")
    submit = page.get_by_role("button", name="Create Auction")
    expect(submit).to_be_enabled()
    submit.click()

    # Success toast text comes from the backend:
    # "Auction item created and will be listed on auction page at ..."
    # Image upload to Cloudinary can take a while, so allow a long timeout.
    toast = page.locator(".Toastify__toast")
    expect(toast.first).to_be_visible(timeout=60_000)
    toast_text = toast.first.inner_text()
    step(f"Toast: {toast_text.strip()}")
    assert "Auction item created" in toast_text, f"Creation failed: {toast_text}"


def verify_in_backend(page: Page) -> None:
    step("Verifying the auction exists in the backend...")
    r = page.request.get(f"{BACKEND_API}/auctionitem/myitems")
    assert r.ok, f"myitems failed: {r.status}"
    items = r.json().get("items", [])
    match = [i for i in items if i["title"] == AUCTION["title"]]
    assert match, "Auction not found in My Auctions API response."

    item = match[-1]  # newest auction with this title
    assert item["category"] == AUCTION["category"]
    assert item["condition"] == AUCTION["condition"]
    assert float(item["startingBid"]) == float(AUCTION["starting_bid"])
    assert item["image"]["url"].startswith("http"), "Image URL missing."
    step(f"Auction saved with id {item['_id']}")
    step(f"Image URL: {item['image']['url']}")


# ---------------------------------------------------------------- main
def main() -> int:
    started = time.time()
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=HEADLESS, slow_mo=SLOW_MO_MS)
        context = browser.new_context(viewport={"width": 1400, "height": 900})
        page = context.new_page()
        try:
            ensure_image()
            check_servers_up(page)
            login(page)
            if CLEANUP_ACTIVE_AUCTIONS:
                cleanup_active_auctions(page)
            fill_and_submit_auction(page)
            verify_in_backend(page)

            # Show the new auction in My Auctions.
            page.goto(f"{FRONTEND_URL}/view-my-auctions")
            expect(page.get_by_text(AUCTION["title"]).first).to_be_visible(timeout=15_000)
            step("Auction is visible on the My Auctions page.")
            if not HEADLESS:
                page.wait_for_timeout(3000)
        except Exception as e:
            shot = Path(__file__).parent / f"failure_{RUN_ID}.png"
            page.screenshot(path=str(shot), full_page=True)
            print(f"\nTEST FAILED: {e}\nScreenshot saved to {shot}")
            browser.close()
            return 1
        browser.close()

    print(f"\nTEST PASSED: auction '{AUCTION['title']}' created "
          f"in {time.time() - started:.1f}s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
