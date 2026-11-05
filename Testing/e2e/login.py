"""
FEATURE 1: LOGIN

We open the real login page in a real browser and check what happens.

  TC-L1 (positive) right email + right password  -> user goes to the Live Auctions page
  TC-L2 (negative) right email + wrong password  -> "Incorrect password." and user stays on /login
  TC-L3 (negative) email that is not registered  -> "No account found with this email."
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # lets "python this_file.py" find helpers.py

import re

from playwright.sync_api import Page, expect

from helpers import snap, login_via_ui, PAUSE_MS
from shared_config import FRONTEND_URL, BIDDER


def submit_login_form(page: Page, email: str, password: str):
    """Open the login page, type the email and password, and press Login."""
    page.context.clear_cookies()                                       # make sure nobody is logged in
    page.goto(f"{FRONTEND_URL}/login", wait_until="domcontentloaded")  # open the login page
    page.get_by_placeholder("Enter your email").fill(email)           # type into the email box
    page.get_by_placeholder("Enter your password").fill(password)     # type into the password box
    page.get_by_role("button", name="Login").click()                  # click the Login button


def test_login_with_valid_credentials_redirects_bidder_to_auctions(page: Page):
    # Step 1: log in with a real Bidder account and wait for the /auctions page.
    login_via_ui(page, BIDDER["email"], BIDDER["password"], "**/auctions")

    # Step 2: check we really are on /auctions and the page heading is shown.
    expect(page).to_have_url(re.compile(r"/auctions$"))
    expect(page.get_by_text("Live Auctions").first).to_be_visible(timeout=15_000)
    snap(page, "logged in, auctions page")   # screenshot for the report
    page.wait_for_timeout(PAUSE_MS)          # short pause so a viewer can see it


def test_login_with_wrong_password_is_rejected(page: Page):
    # Step 1: real email, wrong password.
    submit_login_form(page, BIDDER["email"], "definitely-wrong-password")

    # Step 2: the error message must appear (Playwright waits up to 15 s for it).
    expect(page.get_by_text("Incorrect password.").first).to_be_visible(timeout=15_000)
    snap(page, "incorrect password error")
    # Step 3: the user must NOT be let in, so we are still on /login.
    expect(page).to_have_url(re.compile(r"/login$"))
    page.wait_for_timeout(PAUSE_MS)


def test_login_with_unregistered_email_is_rejected(page: Page):
    # Step 1: an email that has no account.
    submit_login_form(page, "nobody_has_this_email_123@example.com", "whatever123")

    # Step 2: the "no account" message appears and we stay on /login.
    expect(page.get_by_text("No account found with this email.").first).to_be_visible(timeout=15_000)
    snap(page, "no account error")
    expect(page).to_have_url(re.compile(r"/login$"))
    page.wait_for_timeout(PAUSE_MS)

if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
