"""
API TEST 4: DELETE   (DELETE /auctionitem/delete/:id)

No browser. We send requests straight to the backend and check its answer.

  TC-A4  delete a real auction           -> 200 OK
         delete the same auction again   -> 404 "Auction not found." (it is really gone)
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # lets "python this_file.py" find helpers.py

from playwright.sync_api import APIRequestContext

from api_helpers import check, heading, new_auction
from shared_config import BACKEND_API


def test_api_delete_auction(auctioneer_api: APIRequestContext):
    heading("TC-A4  DELETE  -  DELETE /auctionitem/delete/:id")
    # Setup: create an auction so we have something to delete.
    auction_id = new_auction(auctioneer_api)

    # Step 1: delete it -> 200.
    r = auctioneer_api.delete(f"{BACKEND_API}/auctionitem/delete/{auction_id}")
    check("DELETE", r, 200, "real auction -> deleted")

    # Step 2: delete it again -> 404, which proves it was really removed.
    r = auctioneer_api.delete(f"{BACKEND_API}/auctionitem/delete/{auction_id}")
    body = check("DELETE", r, 404, "same auction again -> already gone")
    assert body["message"] == "Auction not found."


if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
