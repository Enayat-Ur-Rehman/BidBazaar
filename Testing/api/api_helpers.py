"""
Shared pieces for the 4 API test files (one per CRUD operation).
"""
import os
import time

from playwright.sync_api import APIRequestContext, APIResponse

from helpers import api_create_auction, API_CALLS
from shared_config import BACKEND_API

MISSING_ID = "64b000000000000000000000"  # valid ObjectId format, but no such document


def check(method: str, response: APIResponse, expected: int, case: str) -> dict:
    """Prints one short, readable block per request, then asserts the status code."""
    path = response.url.replace(BACKEND_API, "")
    try:
        body = response.json()
    except Exception:
        body = {}
    ok = response.status == expected
    message = str(body.get("message", "-"))
    if len(message) > 60:
        message = message[:57] + "..."
    print(f"\n  > {case}")
    print(f"      Request  : {method} {path}")
    print(f"      Response : {response.status} {response.status_text}")
    print(f"      Expected : {expected}")
    print(f"      Message  : {message}")
    print(f"      Result   : {'PASS' if ok else 'FAIL  <-----'}")
    current = os.environ.get("PYTEST_CURRENT_TEST", "").split(" ")[0]
    API_CALLS.setdefault(current, []).append(
        dict(case=case, request=f"{method} {path}", status=f"{response.status} {response.status_text}",
             expected=expected, message=message, ok=ok))
    assert ok, f"{method} {path}: expected {expected}, got {response.status} {body}"
    return body


def heading(text: str):
    print("\n\n  " + "=" * 64)
    print(f"  {text}")
    print("  " + "=" * 64)


def new_auction(request: APIRequestContext) -> str:
    r = api_create_auction(request, f"API Test Auction {int(time.time() * 1000)}")
    return check("POST", r, 201, "(setup) create an auction to work on")["auctionItem"]["_id"]
