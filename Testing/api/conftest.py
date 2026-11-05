"""
Ready-made, logged-in API clients used by the 4 API test files.

An "API client" (APIRequestContext) sends requests straight to the backend,
with no browser window. It remembers its login cookie like a browser does.
"""
import pytest
from playwright.sync_api import Playwright

from helpers import api_login, delete_active_auctions, set_unpaid_commission
from shared_config import AUCTIONEER_FOR_LOAD_TEST as AUCTIONEER, SUPER_ADMIN


@pytest.fixture
def auctioneer_api(playwright: Playwright):
    """An API client logged in as the Auctioneer, with a clean account."""
    request = playwright.request.new_context()
    set_unpaid_commission(AUCTIONEER["email"], 0)  # unpaid commission would block creating auctions
    api_login(request, AUCTIONEER["email"], AUCTIONEER["password"])
    delete_active_auctions(request)
    yield request                                  # <- the test runs here
    set_unpaid_commission(AUCTIONEER["email"], 0)
    delete_active_auctions(request)
    request.dispose()


@pytest.fixture
def admin_api(playwright: Playwright):
    """An API client logged in as the Super Admin."""
    request = playwright.request.new_context()
    api_login(request, SUPER_ADMIN["email"], SUPER_ADMIN["password"])
    yield request                                  # <- the test runs here
    request.dispose()
