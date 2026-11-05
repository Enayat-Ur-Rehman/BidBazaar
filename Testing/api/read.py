"""
API TEST 2: READ   (GET /auctionitem/auction/:id)

No browser. We send requests straight to the backend and check its answer.

  TC-A2  id of a real auction    -> 200 OK, and it returns that auction
         id that does not exist  -> 404 "Auction not found."
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # lets "python this_file.py" find helpers.py

from playwright.sync_api import APIRequestContext

from api_helpers import check, heading, new_auction, MISSING_ID
from shared_config import BACKEND_API


def test_api_read_auction(auctioneer_api: APIRequestContext):
    heading("TC-A2  READ  -  GET /auctionitem/auction/:id")
    # Setup: create an auction so we have something to read.
    auction_id = new_auction(auctioneer_api)

    # Step 1: read it -> 200, and it is the same auction.
    r = auctioneer_api.get(f"{BACKEND_API}/auctionitem/auction/{auction_id}")
    body = check("GET", r, 200, "real auction -> found")
    assert body["auctionItem"]["_id"] == auction_id

    # Step 2: read an id that does not exist -> 404.
    r = auctioneer_api.get(f"{BACKEND_API}/auctionitem/auction/{MISSING_ID}")
    body = check("GET", r, 404, "missing auction -> not found")
    assert body["message"] == "Auction not found."


if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
