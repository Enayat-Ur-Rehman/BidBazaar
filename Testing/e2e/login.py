"""
FEATURE 1 — Login (E2E, real UI + real backend + real DB).

  TC-L1 (positive) valid Bidder credentials -> redirected to /auctions
  TC-L2 (negative) correct email, wrong password -> "Incorrect password." and stays on /login
  TC-L3 (negative) email that has no account -> "No account found with this email."
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # lets "python this_file.py" find helpers.py

import re

from playwright.sync_api import Page, expect

from helpers import snap, login_via_ui, PAUSE_MS
from shared_config import FRONTEND_URL, BIDDER


def submit_login_form(page: Page, email: str, password: str):
    page.context.clear_cookies()
    page.goto(f"{FRONTEND_URL}/login", wait_until="domcontentloaded")
    page.get_by_placeholder("Enter your email").fill(email)
    page.get_by_placeholder("Enter your password").fill(password)
    page.get_by_role("button", name="Login").click()


def test_login_with_valid_credentials_redirects_bidder_to_auctions(page: Page):
    login_via_ui(page, BIDDER["email"], BIDDER["password"], "**/auctions")

    expect(page).to_have_url(re.compile(r"/auctions$"))
    expect(page.get_by_text("Live Auctions").first).to_be_visible(timeout=15_000)
    snap(page, "logged in, auctions page")
    page.wait_for_timeout(PAUSE_MS)


def test_login_with_wrong_password_is_rejected(page: Page):
    submit_login_form(page, BIDDER["email"], "definitely-wrong-password")

    expect(page.get_by_text("Incorrect password.").first).to_be_visible(timeout=15_000)
    snap(page, "incorrect password error")
    expect(page).to_have_url(re.compile(r"/login$"))
    page.wait_for_timeout(PAUSE_MS)


def test_login_with_unregistered_email_is_rejected(page: Page):
    submit_login_form(page, "nobody_has_this_email_123@example.com", "whatever123")

    expect(page.get_by_text("No account found with this email.").first).to_be_visible(timeout=15_000)
    snap(page, "no account error")
    expect(page).to_have_url(re.compile(r"/login$"))
    page.wait_for_timeout(PAUSE_MS)

if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
