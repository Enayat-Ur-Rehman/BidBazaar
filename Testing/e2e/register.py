"""
FEATURE 2: REGISTRATION

We fill the real Sign-Up form in a real browser and check what happens.

  TC-R1 (positive) new Bidder, all fields filled     -> account is created, user goes to the home page
  TC-R2 (negative) email that is already registered  -> "User already registered."
  TC-R3 (negative) Auctioneer with no bank details   -> "Please provide your full bank details.",
                   user stays on /sign-up and NO account is saved in the database
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

EMAIL_PREFIX = "autotest_register_"   # every test account we create starts with this


@pytest.fixture(autouse=True)
def cleanup_registered_users():
    """Runs around every test: after the test, delete the accounts it created."""
    yield
    delete_users_by_email_prefix(EMAIL_PREFIX)


def field(page: Page, label: str):
    """Find the input box that comes right after a label, e.g. "Email"."""
    # SignUp.jsx labels aren't linked to their inputs (no htmlFor), so
    # locate each input as the element right after its <label>.
    return page.locator(f'label:text-is("{label}") + input, label:text-is("{label}") + select')


def fill_personal_details(page: Page, name: str, email: str, role: str):
    """Open /sign-up and fill in the personal fields (bank fields are left empty)."""
    page.context.clear_cookies()                                         # start logged out
    page.goto(f"{FRONTEND_URL}/sign-up", wait_until="domcontentloaded")  # open the Sign-Up page
    expect(page.get_by_role("heading", name="Register")).to_be_visible(timeout=15_000)
    field(page, "Full Name").fill(name)
    field(page, "Email").fill(email)
    field(page, "Phone").fill("03001234567")
    field(page, "Address").fill("Automated Test Street, Karachi")
    field(page, "Role").select_option(role)                              # choose from the drop-down
    field(page, "Password").fill("autotest123")


def test_register_new_bidder_succeeds(page: Page):
    # Step 1: a brand-new email (the time makes it unique), then click Register.
    email = f"{EMAIL_PREFIX}{int(time.time() * 1000)}@example.com"
    fill_personal_details(page, "Autotest Bidder", email, "Bidder")
    page.get_by_role("button", name="Register").click()

    # Step 2: on success the app sends the user to the home page.
    page.wait_for_url(f"{FRONTEND_URL}/", timeout=20_000)
    snap(page, "registered, home page")
    page.wait_for_timeout(PAUSE_MS)
    # Step 3: check the database really has the new user, with role Bidder.
    user = find_user(email)
    assert user is not None, "Registration redirected but no user was saved in the database."
    assert user["role"] == "Bidder"


def test_register_with_existing_email_is_rejected(page: Page):
    # Step 1: use an email that already has an account.
    fill_personal_details(page, "Duplicate User", BIDDER["email"], "Bidder")
    page.get_by_role("button", name="Register").click()

    # Step 2: an error pop-up appears and we stay on /sign-up.
    expect_toast(page, "User already registered.")
    snap(page, "already registered error")
    expect(page).to_have_url(re.compile(r"/sign-up$"))
    page.wait_for_timeout(PAUSE_MS)


def test_register_auctioneer_without_bank_details_is_blocked(page: Page):
    # Step 1: register as an Auctioneer but leave all payout details empty.
    email = f"{EMAIL_PREFIX}{int(time.time() * 1000)}@example.com"
    fill_personal_details(page, "Autotest Auctioneer", email, "Auctioneer")
    # Bank / Easypaisa / PayPal fields deliberately left empty.
    page.get_by_role("button", name="Register").click()

    # Step 2: the app must ask for bank details.
    expect_toast(page, "Please provide your full bank details.")
    snap(page, "bank details error")
    page.wait_for_timeout(PAUSE_MS)

    # Step 3: still on /sign-up, and no account was saved in the database.
    expect(page).to_have_url(re.compile(r"/sign-up$"))
    assert find_user(email) is None, "An Auctioneer was created without any payout details."

if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
