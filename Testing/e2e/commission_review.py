"""
FEATURE 6 — Commission payment proof: Auctioneer submits, Super Admin reviews (E2E).

  TC-M1 (positive) Admin APPROVES a submitted proof -> status Approved (or Settled by the cron)
  TC-M2 (negative) Admin REJECTS a submitted proof -> status Rejected
  TC-M3 (negative) Auctioneer submits more than they owe -> "amount exceeds your unpaid
                   commission balance", no proof is created

An unpaidCommission balance normally appears only after an auction-ended
cron runs, so it is seeded in MongoDB (setup only).
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # lets "python this_file.py" find helpers.py

import time

import pytest
from playwright.sync_api import Page, expect

from helpers import snap, login_via_ui, expect_toast, set_unpaid_commission, WATCH_IMAGE, PAUSE_MS
from shared_config import FRONTEND_URL, BACKEND_API, AUCTIONEER_FOR_INTEGRATION_TEST as AUCTIONEER, SUPER_ADMIN

OWED = 1000
COMMENT_PREFIX = "E2E proof "


def all_proofs(page: Page):
    return page.request.get(f"{BACKEND_API}/superadmin/paymentproofs/getall").json().get("paymentProofs", [])


def delete_test_proofs(page: Page):
    for p in all_proofs(page):
        if (p.get("comment") or "").startswith(COMMENT_PREFIX):
            page.request.delete(f"{BACKEND_API}/superadmin/paymentproof/delete/{p['_id']}")


@pytest.fixture
def owed_commission(page: Page):
    set_unpaid_commission(AUCTIONEER["email"], OWED)
    yield
    set_unpaid_commission(AUCTIONEER["email"], 0)
    login_via_ui(page, SUPER_ADMIN["email"], SUPER_ADMIN["password"], "**/dashboard")
    delete_test_proofs(page)


def submit_proof_as_auctioneer(page: Page, amount: int, comment: str):
    login_via_ui(page, AUCTIONEER["email"], AUCTIONEER["password"], "**/view-my-auctions")
    page.goto(f"{FRONTEND_URL}/submit-commission")
    page.get_by_placeholder("0.00").fill(str(amount))
    page.get_by_placeholder("Add any additional information about your payment...").fill(comment)
    page.locator("#file-upload").set_input_files(str(WATCH_IMAGE))
    page.get_by_role("button", name="Submit Payment Proof").click()


def review_as_admin(page: Page, comment: str, new_status: str) -> str:
    login_via_ui(page, SUPER_ADMIN["email"], SUPER_ADMIN["password"], "**/dashboard")
    # PaymentProofs.jsx renders the API array in order, so its index is the table row.
    row = next(i for i, p in enumerate(all_proofs(page)) if p.get("comment") == comment)
    page.locator("table tbody tr").nth(row).get_by_role("button", name="Update").click()
    expect(page.locator("textarea[disabled]")).to_have_value(comment, timeout=10_000)
    page.locator("select").select_option(new_status)
    page.wait_for_timeout(PAUSE_MS)
    snap(page, f"admin sets {new_status}")
    page.get_by_role("button", name="Update Payment Proof").click()
    page.wait_for_timeout(PAUSE_MS)
    snap(page, f"status updated to {new_status}")
    return next(p["status"] for p in all_proofs(page) if p.get("comment") == comment)


def test_admin_approves_commission_proof(page: Page, owed_commission):
    comment = f"{COMMENT_PREFIX}{int(time.time())} approve"
    submit_proof_as_auctioneer(page, 400, comment)
    expect_toast(page, "")  # any confirmation toast
    snap(page, "proof submitted")
    page.wait_for_timeout(PAUSE_MS)

    status = review_as_admin(page, comment, "Approved")
    # verifyCommissionCron.js auto-settles Approved proofs every minute.
    assert status in ("Approved", "Settled"), f"Expected Approved, got {status}"


def test_admin_rejects_commission_proof(page: Page, owed_commission):
    comment = f"{COMMENT_PREFIX}{int(time.time())} reject"
    submit_proof_as_auctioneer(page, 300, comment)
    expect_toast(page, "")
    snap(page, "proof submitted")
    page.wait_for_timeout(PAUSE_MS)

    status = review_as_admin(page, comment, "Rejected")
    assert status == "Rejected", f"Expected Rejected, got {status}"


def test_submitting_more_than_owed_commission_is_rejected(page: Page, owed_commission):
    comment = f"{COMMENT_PREFIX}{int(time.time())} too much"
    submit_proof_as_auctioneer(page, OWED + 5000, comment)

    expect_toast(page, "exceeds your unpaid commission balance")
    snap(page, "exceeds balance error")
    page.wait_for_timeout(PAUSE_MS)
    login_via_ui(page, SUPER_ADMIN["email"], SUPER_ADMIN["password"], "**/dashboard")
    assert not any(p.get("comment") == comment for p in all_proofs(page)), "Over-payment proof was saved."

if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
