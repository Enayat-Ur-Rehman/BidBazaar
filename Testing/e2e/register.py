"""
FEATURE 2 — Registration (E2E, real /sign-up form).

  TC-R1 (positive) new Bidder with all fields -> account created, redirected to home
  TC-R2 (negative) email that is already registered -> "User already registered."
  TC-R3 (negative) Auctioneer with no bank/payout details -> "Please provide your full bank
                   details." popup, user stays on /sign-up and no account is created in the DB
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # lets "python this_file.py" find helpers.py

import re
import time

import pytest
from playwright.sync_api import Page, expect

from helpers import snap, expect_toast, find_user, delete_users_by_email_prefix, PAUSE_MS
from shared_config import FRONTEND_URL, BIDDER

EMAIL_PREFIX = "autotest_register_"


@pytest.fixture(autouse=True)
def cleanup_registered_users():
    yield
    delete_users_by_email_prefix(EMAIL_PREFIX)


def field(page: Page, label: str):
    # SignUp.jsx labels aren't linked to their inputs (no htmlFor), so
    # locate each input as the element right after its <label>.
    return page.locator(f'label:text-is("{label}") + input, label:text-is("{label}") + select')


def fill_personal_details(page: Page, name: str, email: str, role: str):
    page.context.clear_cookies()
    page.goto(f"{FRONTEND_URL}/sign-up", wait_until="domcontentloaded")
    expect(page.get_by_role("heading", name="Register")).to_be_visible(timeout=15_000)
    field(page, "Full Name").fill(name)
    field(page, "Email").fill(email)
    field(page, "Phone").fill("03001234567")
    field(page, "Address").fill("Automated Test Street, Karachi")
    field(page, "Role").select_option(role)
    field(page, "Password").fill("autotest123")


def test_register_new_bidder_succeeds(page: Page):
    email = f"{EMAIL_PREFIX}{int(time.time() * 1000)}@example.com"
    fill_personal_details(page, "Autotest Bidder", email, "Bidder")
    page.get_by_role("button", name="Register").click()

    page.wait_for_url(f"{FRONTEND_URL}/", timeout=20_000)
    snap(page, "registered, home page")
    page.wait_for_timeout(PAUSE_MS)
    user = find_user(email)
    assert user is not None, "Registration redirected but no user was saved in the database."
    assert user["role"] == "Bidder"


def test_register_with_existing_email_is_rejected(page: Page):
    fill_personal_details(page, "Duplicate User", BIDDER["email"], "Bidder")
    page.get_by_role("button", name="Register").click()

    expect_toast(page, "User already registered.")
    snap(page, "already registered error")
    expect(page).to_have_url(re.compile(r"/sign-up$"))
    page.wait_for_timeout(PAUSE_MS)


def test_register_auctioneer_without_bank_details_is_blocked(page: Page):
    email = f"{EMAIL_PREFIX}{int(time.time() * 1000)}@example.com"
    fill_personal_details(page, "Autotest Auctioneer", email, "Auctioneer")
    # Bank / Easypaisa / PayPal fields deliberately left empty.
    page.get_by_role("button", name="Register").click()

    expect_toast(page, "Please provide your full bank details.")
    snap(page, "bank details error")
    page.wait_for_timeout(PAUSE_MS)

    expect(page).to_have_url(re.compile(r"/sign-up$"))
    assert find_user(email) is None, "An Auctioneer was created without any payout details."

if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
