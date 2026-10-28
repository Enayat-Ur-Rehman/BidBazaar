"""
API TEST 3 — UPDATE   PUT /superadmin/paymentproof/status/update/:id   (Super Admin)

  TC-A3  real commission proof -> status set to Rejected  -> 200 OK
         id that matches no proof                         -> 404 "Payment proof not found."
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # lets "python this_file.py" find helpers.py

import time

from playwright.sync_api import APIRequestContext

from api_helpers import check, heading, MISSING_ID
from helpers import set_unpaid_commission, WATCH_IMAGE
from shared_config import BACKEND_API, AUCTIONEER_FOR_LOAD_TEST as AUCTIONEER


def test_api_update_payment_proof_status(auctioneer_api: APIRequestContext, admin_api: APIRequestContext):
    heading("TC-A3  UPDATE  -  PUT /superadmin/paymentproof/status/update/:id")
    set_unpaid_commission(AUCTIONEER["email"], 1000)  # a proof can only be submitted while commission is owed
    proof_id = None
    try:
        r = auctioneer_api.post(f"{BACKEND_API}/commission/proof", multipart={
            "amount": "500", "comment": f"API update test {int(time.time())}",
            "proof": {"name": WATCH_IMAGE.name, "mimeType": "image/jpeg", "buffer": WATCH_IMAGE.read_bytes()},
        })
        proof_id = check("POST", r, 201, "(setup) submit a commission proof")["commissionProof"]["_id"]

        r = admin_api.put(f"{BACKEND_API}/superadmin/paymentproof/status/update/{proof_id}",
                          data={"status": "Rejected", "amount": 500})
        body = check("PUT", r, 200, "real proof -> status updated")
        assert body["proof"]["status"] == "Rejected"

        r = admin_api.put(f"{BACKEND_API}/superadmin/paymentproof/status/update/{MISSING_ID}",
                          data={"status": "Rejected", "amount": 500})
        body = check("PUT", r, 404, "missing proof -> not found")
        assert body["message"] == "Payment proof not found."
    finally:
        if proof_id:
            admin_api.delete(f"{BACKEND_API}/superadmin/paymentproof/delete/{proof_id}")


if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
