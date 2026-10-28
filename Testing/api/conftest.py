"""
Logged-in API clients shared by the 4 API test files.
"""
import pytest
from playwright.sync_api import Playwright

from helpers import api_login, delete_active_auctions, set_unpaid_commission
from shared_config import AUCTIONEER_FOR_LOAD_TEST as AUCTIONEER, SUPER_ADMIN


@pytest.fixture
def auctioneer_api(playwright: Playwright):
    request = playwright.request.new_context()
    set_unpaid_commission(AUCTIONEER["email"], 0)  # unpaid commission would block creating auctions
    api_login(request, AUCTIONEER["email"], AUCTIONEER["password"])
    delete_active_auctions(request)
    yield request
    set_unpaid_commission(AUCTIONEER["email"], 0)
    delete_active_auctions(request)
    request.dispose()


@pytest.fixture
def admin_api(playwright: Playwright):
    request = playwright.request.new_context()
    api_login(request, SUPER_ADMIN["email"], SUPER_ADMIN["password"])
    yield request
    request.dispose()
