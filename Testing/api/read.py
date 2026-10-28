"""
API TEST 2 — READ   GET /auctionitem/auction/:id

  TC-A2  id of a real auction        -> 200 OK, returns that auction
         id that matches no auction  -> 404 "Auction not found."
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # lets "python this_file.py" find helpers.py

from playwright.sync_api import APIRequestContext

from api_helpers import check, heading, new_auction, MISSING_ID
from shared_config import BACKEND_API


def test_api_read_auction(auctioneer_api: APIRequestContext):
    heading("TC-A2  READ  -  GET /auctionitem/auction/:id")
    auction_id = new_auction(auctioneer_api)

    r = auctioneer_api.get(f"{BACKEND_API}/auctionitem/auction/{auction_id}")
    body = check("GET", r, 200, "real auction -> found")
    assert body["auctionItem"]["_id"] == auction_id

    r = auctioneer_api.get(f"{BACKEND_API}/auctionitem/auction/{MISSING_ID}")
    body = check("GET", r, 404, "missing auction -> not found")
    assert body["message"] == "Auction not found."


if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
