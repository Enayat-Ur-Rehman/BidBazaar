"""
Shared helpers used by every test file in e2e/, api/ and mocking/.

Setup/cleanup goes through the backend API or MongoDB directly — that
is test *preparation*, not the behaviour under test. The behaviour
under test is always driven through the real UI (E2E) or the real
HTTP endpoints (API tests).
"""
import os
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

from bson import ObjectId
from playwright.sync_api import Page, APIRequestContext, expect
from pymongo import MongoClient

from shared_config import FRONTEND_URL, BACKEND_API, MONGO_URI, BIDDER

ASSETS = Path(__file__).parent / "assets"
WATCH_IMAGE = ASSETS / "gold_watch.jpg"  # JPEG, not WebP: Playwright's WebKit uploads .webp as application/octet-stream
CAR_IMAGE = ASSETS / "sports_car.jpg"

PAUSE_MS = 1500  # keep each result on screen long enough to read in --headed runs
BROWSERS = ("chromium", "firefox", "webkit")


def run_this_file(test_file: str):
    """Lets every test file run directly:  python login.py   (report: reports/login.html)

      python login.py                 visible browser, all 3 browsers
      python login.py chromium        visible browser, Chromium only
      python login.py firefox webkit  any subset of browsers
      python login.py --headless      no visible window
    Any other pytest option (e.g. -k wrong_password) is passed through.
    """
    import pytest
    os.chdir(Path(__file__).parent)  # so pytest.ini, conftest.py and reports/ are always found
    args = [test_file, "-s", "--no-header"]  # -s: show print() output (API request/response blocks)
    extra = sys.argv[1:]
    name = Path(test_file).stem
    # Own report per file (reports/login.html ...) so the full-run reports/report.html is kept.
    args += ["-o", f"addopts=-v --screenshot on --output reports/{name}-results "
                   f"--html reports/{name}.html --self-contained-html"]
    for b in [a for a in extra if a in BROWSERS] or BROWSERS:
        args += ["--browser", b]
    if "--headless" not in extra:
        args += ["--headed", "--slowmo", "300"]
    args += [a for a in extra if a not in BROWSERS and a != "--headless"]
    sys.exit(pytest.main(args))


# ---------------------------------------------------------------- UI

def login_via_ui(page: Page, email: str, password: str, redirect_url_pattern: str):
    # Login.jsx auto-redirects away from /login when a session cookie
    # already exists, so always start from a logged-out browser.
    page.context.clear_cookies()
    page.goto(f"{FRONTEND_URL}/login", wait_until="domcontentloaded")  # don't wait on third-party scripts (Stripe.js)
    page.get_by_placeholder("Enter your email").fill(email)
    page.get_by_placeholder("Enter your password").fill(password)
    page.get_by_role("button", name="Login").click()
    page.wait_for_url(redirect_url_pattern, timeout=15_000, wait_until="domcontentloaded")


SCREENSHOTS = Path(__file__).parent / "reports" / "screenshots"
_snap_count = {}
API_CALLS = {}  # test node id -> request/response rows printed by api/api_helpers.check()
SNAPS = {}  # test node id -> [(label, png path)]; conftest.py embeds these in the HTML report


def snap(page: Page, label: str):
    """Screenshot the moment a success/error message is on screen.
    Saved as reports/screenshots/<file>/<test>[<browser>]__<n>_<label>.png"""
    current = os.environ.get("PYTEST_CURRENT_TEST", "unknown::unknown").split(" ")[0]
    file_part, test_part = current.split("::", 1)
    n = _snap_count[current] = _snap_count.get(current, 0) + 1
    folder = SCREENSHOTS / Path(file_part).stem
    folder.mkdir(parents=True, exist_ok=True)
    page.wait_for_timeout(500)  # let the toast finish sliding in
    path = folder / f"{test_part}__{n}_{label.replace(' ', '_')}.png"
    page.screenshot(path=str(path))
    SNAPS.setdefault(current, []).append((label, path))


def expect_toast(page: Page, text: str, timeout: int = 15_000):
    toast = page.locator(".Toastify__toast", has_text=text)
    expect(toast.first).to_be_visible(timeout=timeout)


def fill_create_auction_form(page: Page, title: str, starting_bid: int, start: datetime, end: datetime,
                             image: Path = WATCH_IMAGE):
    page.get_by_placeholder("Enter auction title").fill(title)
    page.locator("select", has=page.locator("option", has_text="Select Category")) \
        .select_option("Jewelry & Watches")
    page.locator("select", has=page.locator("option", has_text="Select Condition")) \
        .select_option("New")
    page.get_by_placeholder("0.00").fill(str(starting_bid))
    page.get_by_placeholder("Provide a detailed description of your item...") \
        .fill("Created by the automated E2E test.")
    times = page.locator('input[type="datetime-local"]')
    times.nth(0).fill(start.strftime("%Y-%m-%dT%H:%M"))
    times.nth(1).fill(end.strftime("%Y-%m-%dT%H:%M"))
    page.locator('input[type="file"]').set_input_files(str(image))
    expect(page.get_by_alt_text("Preview")).to_be_visible()


# ---------------------------------------------------------------- API

def api_login(request: APIRequestContext, email: str, password: str):
    r = request.post(f"{BACKEND_API}/user/login", form={"email": email, "password": password})
    assert r.ok, f"API login failed for {email}: {r.status} {r.text()}"


def api_create_auction(request: APIRequestContext, title: str, starting_bid: int = 1000,
                       start_in_seconds: int = 2, image: Path = WATCH_IMAGE):
    start = datetime.now() + timedelta(seconds=start_in_seconds)
    end = start + timedelta(days=1)
    return request.post(
        f"{BACKEND_API}/auctionitem/create",
        multipart={
            "title": title,
            "description": "Seeded by the automated test suite.",
            "category": "Jewelry & Watches",
            "condition": "New",
            "startingBid": str(starting_bid),
            "startTime": start.isoformat(),
            "endTime": end.isoformat(),
            "image": {"name": image.name, "mimeType": "image/webp" if image.suffix == ".webp" else "image/jpeg",
                      "buffer": image.read_bytes()},
        },
    )


def delete_active_auctions(request: APIRequestContext):
    # The backend allows only ONE active auction per auctioneer, so
    # re-runs (and runs on the next browser) must clean up first.
    r = request.get(f"{BACKEND_API}/auctionitem/myitems")
    now = datetime.now().astimezone()
    for item in r.json().get("items", []):
        try:
            end = datetime.fromisoformat(str(item["endTime"]).replace("Z", "+00:00"))
        except ValueError:
            end = None
        if end is None or end > now:
            request.delete(f"{BACKEND_API}/auctionitem/delete/{item['_id']}")


def register_temp_auctioneer(request: APIRequestContext) -> dict:
    ts = int(time.time() * 1000)
    email = f"autotest_auctioneer_{ts}@example.com"
    password = "autotest123"
    r = request.post(f"{BACKEND_API}/user/register", multipart={
        "userName": f"Autotest Auctioneer {ts}", "email": email, "password": password,
        "phone": "03001234567", "address": "Test Address", "role": "Auctioneer",
        "bankAccountName": "Autotest", "bankAccountNumber": "1234567890", "bankName": "Test Bank",
        "easypaisaAccountNumber": "03001234567", "paypalEmail": email,
    })
    assert r.ok, f"Temp auctioneer registration failed: {r.status} {r.text()}"
    return {"email": email, "password": password}


# ---------------------------------------------------------------- MongoDB

def db():
    client = MongoClient(MONGO_URI)
    return client, client.get_default_database()


def set_unpaid_commission(email: str, amount: int):
    client, d = db()
    d["users"].update_one({"email": email}, {"$set": {"unpaidCommission": amount}})
    client.close()


def find_user(email: str):
    client, d = db()
    user = d["users"].find_one({"email": email})
    client.close()
    return user


def delete_users_by_email_prefix(prefix: str):
    client, d = db()
    d["users"].delete_many({"email": {"$regex": f"^{prefix}"}})
    client.close()


def seed_pending_payment(auction_id: str, bid_amount: int, expires_in: timedelta) -> str:
    # A real pending payment only exists after the "auction ended" cron
    # runs for a won auction — too slow/async for a test — so it is
    # seeded directly. A negative `expires_in` seeds an expired one.
    client, d = db()
    bidder = d["users"].find_one({"email": BIDDER["email"]})
    assert bidder, f"Seeded bidder {BIDDER['email']} not found in DB."
    result = d["payments"].insert_one({
        "auctionItem": ObjectId(auction_id),
        "bidder": bidder["_id"],
        "bidAmount": bid_amount,
        "paymentAmount": round(bid_amount * 0.2, 2),
        "paymentStatus": "Pending",
        "expiresAt": datetime.now(timezone.utc) + expires_in,  # tz-aware: pymongo treats naive datetimes as UTC
        "bidderSequence": 0,
        "reason": "Automated payment test",
    })
    client.close()
    return str(result.inserted_id)


def get_payment_status(payment_id: str) -> str:
    client, d = db()
    doc = d["payments"].find_one({"_id": ObjectId(payment_id)})
    client.close()
    return doc["paymentStatus"]


def delete_payment_and_auction(payment_id: str, auction_id: str):
    client, d = db()
    d["payments"].delete_one({"_id": ObjectId(payment_id)})
    d["auctions"].delete_one({"_id": ObjectId(auction_id)})
    client.close()
