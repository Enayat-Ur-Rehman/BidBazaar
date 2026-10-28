# BidBazaar: Local Setup and Testing Guide

This guide explains how to set up BidBazaar locally and run its automated tests, and where everything lives in the project. Work through it from top to bottom.

BidBazaar is an online auction platform built with MongoDB, Express, React and Node (MERN). The automated tests use Playwright for Python with pytest.

| Part | Folder | Runs on |
|---|---|---|
| Backend API (Express + MongoDB) | `backend/` | http://localhost:5000/api/v1 |
| Frontend (React + Vite) | `frontend/` | http://localhost:5173 |
| Automated tests | `Testing/` | Run with Python/pytest. They need the backend and frontend running. |

---

## 1. Prerequisites

Install these first. The versions in brackets were used to develop the project.

| Tool | Version | Check with |
|---|---|---|
| Node.js | 22.x (22.13.1) | `node -v` |
| Python | 3.12 (3.12.1) | `python --version` |
| MongoDB Community Server | 7 or newer, running locally on port 27017 | `mongosh --eval "db.runCommand({ping:1})"` |
| Internet connection | | Needed for Cloudinary image uploads and Stripe test payments |

On Windows, install MongoDB as a service so it is always running. Docker also works: `docker run -d -p 27017:27017 --name mongo mongo:7`.

---

## 2. Project map: what is where

```
BidBazaar/
├── SETUP_AND_TESTING_GUIDE.md   <- this file
├── backend/
│   ├── server.js                entry point (npm start)
│   ├── app.js                   Express app; loads config/config.env
│   ├── config/config.env        all backend settings and secrets (see section 3)
│   ├── seedTestAccounts.js      creates the 5 accounts the tests log in with
│   ├── controllers/  router/  models/  services/  middlewares/  utils/
│   ├── automation/              cron jobs (auction end, commission settling)
│   └── database/                MongoDB connection (database name MERN_AUCTION_PLATFORM)
├── frontend/
│   ├── .env                     VITE_STRIPE_PUBLIC_KEY
│   └── src/                     React app (pages/, components/, store/ = Redux slices)
│                                The API URL http://localhost:5000 is hardcoded in src/store/slices/*.js
└── Testing/
    ├── requirements.txt         Python packages for the tests
    ├── pytest.ini               default options (3 browsers, screenshots, HTML report)
    ├── shared_config.py         URLs, MongoDB URI and the 5 test accounts
    ├── helpers.py               shared login/seed/cleanup helpers, snap() screenshots
    ├── conftest.py              HTML report customisation, zoom-out for headed runs
    ├── report_style.css         look of the HTML reports
    ├── e2e/                     18 end-to-end tests (6 features x 3)
    │   ├── login.py  register.py  create_auction.py
    │   └── place_bid.py  payment.py  commission_review.py
    ├── api/                     4 API CRUD tests (one file per operation)
    │   ├── create.py  read.py  update.py  delete.py
    │   ├── api_helpers.py       prints each request/response
    │   └── conftest.py          logged-in API fixtures
    ├── mocking/                 2 network-mocking tests
    │   └── empty_data.py  server_error.py
    ├── bug_demo.py              inserts a deliberate bug, shows the test fail, removes the bug, shows it pass
    ├── assets/                  images uploaded by the tests (gold_watch.jpg, sports_car.jpg)
    ├── REPORT.md                written test report (test case table, features, bugs)
    ├── BidBazaar_Test_Report.docx  the same report as a Word file, with screenshots
    └── reports/                 generated output: HTML reports, screenshots/, logs/
```

You can ignore the other `.md` and `.thy` files in the root folder. They are notes from other coursework.

---

## 3. Configuration

### `backend/config/config.env`
The backend needs these variables:

```
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017
JWT_SECRET_KEY=<any long random string>
JWT_EXPIRE=1d
COOKIE_EXPIRE=5
CLOUDINARY_CLOUD_NAME=...   CLOUDINARY_API_KEY=...   CLOUDINARY_API_SECRET=...
SMTP_HOST=smtp.gmail.com  SMTP_PORT=587  SMTP_SERVICE=gmail  SMTP_MAIL=...  SMTP_PASSWORD=...
STRIPE_PUBLIC_KEY=pk_test_...   STRIPE_SECRET_KEY=sk_test_...
```

- **If the zip already contains `config.env`**, keep it. Check one thing: `MONGO_URI`. If it contains a username and password (`mongodb://user:pass@localhost...`) but your local MongoDB has no authentication, change it to `mongodb://localhost:27017`.
- **Cloudinary keys are required.** Every auction image upload goes to Cloudinary.
- **Stripe keys must be test-mode keys** (`pk_test_` / `sk_test_`). The payment tests use Stripe's test cards.
- **SMTP can be invalid.** Failed emails are only logged as errors in the backend console and do not affect the tests.

### `frontend/.env`
```
VITE_STRIPE_PUBLIC_KEY=pk_test_...   (the same public key as the backend)
```

### `Testing/shared_config.py`
This file contains `MONGO_URI = "mongodb://localhost:27017/MERN_AUCTION_PLATFORM"`. The tests use it to read and reset data directly in MongoDB. Change it only if your MongoDB is not on `localhost:27017`.

---

## 4. Install

Run these from the project root, `BidBazaar/`:

```bash
# backend
cd backend
npm install
cd ..

# frontend
cd frontend
npm install
cd ..

# tests
cd Testing
pip install -r requirements.txt
python -m playwright install          # downloads Chromium, Firefox and WebKit
cd ..
```

If the zip contained `node_modules` folders from another machine, delete them and run `npm install` again. The `bcrypt` package is compiled for each operating system.

---

## 5. Create the test accounts (once)

The tests log in with 5 fixed accounts, listed in `Testing/shared_config.py`. Create them in your local database:

```bash
cd backend
node seedTestAccounts.js
```

Expected output: 5 lines starting with `created` (or `exists`), then `Test accounts ready.`

| Role | Email | Password | Used by |
|---|---|---|---|
| Bidder | ammarkhanty2@gmail.com | 12345678 | login, register, place_bid, payment |
| Auctioneer | ammar@gmail.com | ammar@12 | create_auction |
| Auctioneer | ammar1@gmail.com | 12345678 | place_bid, commission_review |
| Auctioneer | ammar3@gmail.com | 12345678 | api/* tests |
| Super Admin | superadmin@gmail.com | 12345678 | commission_review, api/update.py |

You can run the script again at any time. It also resets each account's unpaid commission to 0, which helps if a test run was interrupted.

---

## 6. Start the app

Use two separate terminals and leave both running while you test.

```bash
# terminal 1
cd backend
npm start            # wait for "Server listening on port 5000" and "Connected to database."

# terminal 2
cd frontend
npm run dev          # serves http://localhost:5173
```

Check that it works: open http://localhost:5173, log in as `ammarkhanty2@gmail.com` / `12345678`, and you should land on **Live Auctions**.

---

## 7. Run the tests

All commands start from `BidBazaar/Testing`.

> **Important:** never run two test commands at the same time. All tests share the same 5 accounts in the database, so parallel runs break each other. The failures look like "already have one active auction" or "unpaid commission" errors.

### Everything at once (all 3 browsers)
```bash
cd Testing
pytest
```
This runs 64 tests: 20 browser tests on each of Chromium, Firefox and WebKit, plus the 4 API tests. It takes about 7 minutes. The report goes to `reports/report.html`.

### Only Chromium, without a visible window
```bash
pytest -o addopts="-v" --browser chromium --html reports/report.html --self-contained-html
```

### One file at a time, with a visible browser
Each test file can be run directly:
```bash
cd e2e
python login.py                 # visible browser, all 3 browsers
python login.py chromium        # visible browser, Chromium only
python login.py --headless      # no window
python login.py chromium -k wrong_password   # one test only
```
The same pattern works for every file:
- `e2e/`: `login.py`, `register.py`, `create_auction.py`, `place_bid.py`, `payment.py`, `commission_review.py`
- `api/`: `create.py`, `read.py`, `update.py`, `delete.py` (these print each request and response in the terminal)
- `mocking/`: `empty_data.py`, `server_error.py`

Each file writes its own report, for example `reports/login.html`. In visible runs the page is zoomed out to 80% so the whole layout fits on screen.

### Deliberate-bug demo
```bash
cd Testing
python bug_demo.py              # add --headless to hide the browser
```
The script does four things:
1. Changes the minimum-bid check in `frontend/src/pages/AuctionItem.jsx` to an off-by-one version.
2. Runs test TC-B1, which **FAILS**.
3. Restores the file. This always happens, even if the run crashes.
4. Runs TC-B1 again, which **PASSES**.

The reports are `reports/report_with_bug.html` and `reports/report_bug_fixed.html`.

### Viewing the results
- **HTML reports:** in `Testing/reports/`, open them in a web browser (on Windows: `start reports\login.html`). Each row shows the test case ID and type; click a row to see the screenshots of the success or error message.
- **Screenshots:** in `Testing/reports/screenshots/<file>/`, taken at the moment each message was on screen.
- **Written report:** `Testing/REPORT.md` and `Testing/BidBazaar_Test_Report.docx`.

---

## 8. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `500 Failed to created auction.` or an image upload fails | Cloudinary keys are wrong, or there was a temporary network problem. Check the keys, then re-run the file. |
| Login fails for a test account / "No account found" | Run `node seedTestAccounts.js` in `backend/`. |
| "You already have one active auction" or "Unpaid Commission" in a test that should pass | A previous run was interrupted, or two runs overlapped. Run `node seedTestAccounts.js` again and run the tests one at a time. |
| Payment tests time out on checkout.stripe.com | Stripe needs internet access and **test** keys (`sk_test_`) in `config.env`. |
| `page.goto` timeout on the first test | The frontend (`npm run dev`) or backend (`npm start`) isn't running. |
| `Executable doesn't exist` (Playwright) | Run `python -m playwright install`. |
| `ModuleNotFoundError: helpers` | Run tests from inside `Testing/` (or its subfolders), not from the project root. |
| Backend log shows `Email Sending Failed ... Invalid login` | SMTP credentials are invalid. This is harmless for the tests. |
| Port 5000 or 5173 already in use | Stop the other process, or change `PORT` / `FRONTEND_URL` in `config.env`. If you change them, also change `Testing/shared_config.py` and the hardcoded `localhost:5000` in `frontend/src/store/slices/*.js`. |
