"""
API TEST 1 — CREATE   POST /auctionitem/create

  TC-A1  valid auction (all fields + image)  -> 201 Created
         same request without an image       -> 400 "Auction item image required."
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # lets "python this_file.py" find helpers.py

import time

from playwright.sync_api import APIRequestContext

from api_helpers import check, heading
from helpers import api_create_auction, delete_active_auctions
from shared_config import BACKEND_API


def test_api_create_auction(auctioneer_api: APIRequestContext):
    heading("TC-A1  CREATE  -  POST /auctionitem/create")
    r = api_create_auction(auctioneer_api, f"API Create {int(time.time())}", starting_bid=2500)
    body = check("POST", r, 201, "valid auction -> created")
    assert body["success"] is True
    assert body["auctionItem"]["startingBid"] == 2500

    delete_active_auctions(auctioneer_api)
    r = auctioneer_api.post(f"{BACKEND_API}/auctionitem/create", multipart={"title": "No image"})
    body = check("POST", r, 400, "no image -> rejected")
    assert body["message"] == "Auction item image required."


if __name__ == "__main__":
    from helpers import run_this_file
    run_this_file(__file__)
