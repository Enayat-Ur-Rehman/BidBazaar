"""
Shared constants for all test files in this folder.
Keeping URLs and test accounts in one place avoids typos when the
same values are repeated across test_*.py files.
"""

FRONTEND_URL = "http://localhost:5173"
BACKEND_API = "http://localhost:5000/api/v1"
MONGO_URI = "mongodb://localhost:27017/MERN_AUCTION_PLATFORM"

# Known seeded accounts that must already exist in the database.
# Each one is dedicated to a different test file so the tests don't
# step on each other's "one active auction" / unpaidCommission state.
AUCTIONEER_FOR_SYSTEM_TEST = {"email": "ammar@gmail.com", "password": "ammar@12"}
AUCTIONEER_FOR_INTEGRATION_TEST = {"email": "ammar1@gmail.com", "password": "12345678"}
AUCTIONEER_FOR_LOAD_TEST = {"email": "ammar3@gmail.com", "password": "12345678"}
SUPER_ADMIN = {"email": "superadmin@gmail.com", "password": "12345678"}
BIDDER = {"email": "ammarkhanty2@gmail.com", "password": "12345678"}
