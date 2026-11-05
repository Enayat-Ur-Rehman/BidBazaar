# BidBazaar — Automated Testing Report

**Tool:** Playwright (Python) + pytest + pytest-html
**Browsers:** Chromium, Firefox, WebKit (Safari engine)
**System under test:** BidBazaar MERN auction platform (React/Vite frontend on :5173, Express API on :5000, MongoDB)

## 1. How to run

```bash
cd Testing
pip install pytest-playwright pytest-html pymongo
playwright install
pytest                               # all tests, all 3 browsers -> reports/report.html
pytest --headed --slowmo 300 e2e/place_bid.py   # watch one feature

cd e2e    &&  python login.py         # any test file runs on its own (visible browser)
cd api    &&  python read.py          # prints each request / response status
cd network && python empty_data.py
python bug_demo.py                                  # deliberate-bug demo (fail -> pass)
```

`pytest.ini` already adds `--browser chromium --browser firefox --browser webkit`,
`--screenshot on` and `--html reports/report.html`, so a plain `pytest` produces everything.

## 2. Folder structure

| Folder / file | Contents |
|---|---|
| `e2e/` | 5 features × 3 end-to-end tests = 15 tests |
| `api/create.py`, `read.py`, `update.py`, `delete.py` | 4 API tests, one file per operation (Create / Read / Update / Delete); each prints every request and the status code returned |
| `network/empty_data.py`, `server_error.py` | 2 network-mocking tests, one file each (empty data, server error) |
| `bug_demo.py` | inserts each deliberate bug, runs its test (fails), removes the bug, runs the test again (passes) |
| `helpers.py`, `shared_config.py`, `conftest.py` | shared login/seed/cleanup helpers, URLs and accounts, screenshot-in-report hook |
| `reports/report.html` | HTML report of the clean run (all browsers) |
| `reports/report_bid_bug.html`, `report_bid_fixed.html` | TC-B1 with the minimum-bid bug (FAILED) / after removing it (PASSED) |
| `reports/report_payment_bug.html`, `report_payment_fixed.html` | TC-P3 with the expired-payment bug (FAILED) / after removing it (PASSED) |
| `reports/test-results/` | screenshot of every test, per browser |

## 3. Features tested and why

| # | Feature | Why it was chosen |
|---|---|---|
| 1 | Login | Gate to every other feature; role-based redirect |
| 2 | Registration | Entry point for new users; Auctioneer has extra mandatory payout fields |
| 3 | Create Auction | Core Auctioneer flow with business rules (one active auction, unpaid commission) |
| 4 | Place Bid | Core Bidder flow; minimum-bid boundary and re-bid state change |
| 5 | Stripe Payment | Real money flow (20% win deposit) through Stripe test mode |

### Features left out and why

| Feature | Reason |
|---|---|
| Leaderboard, Home, About, Contact, How-it-works | Read-only/static pages, low risk; covered indirectly by network-mocking and page loads |
| Auction search / filter | Pure client-side filtering, lower risk than the money and bidding flows |
| Republish auction | Needs an *ended* auction; depends on cron timing, slow to set up reliably |
| Auction-end cron & fallback to 2nd bidder | Time-driven background job, better tested by backend unit tests than E2E |
| Email notifications | External SMTP service; not observable from the browser |
| Commission proof review (Super Admin) | Slow multi-role flow (Auctioneer uploads, Super Admin reviews) that only moves money between users outside the platform; its update endpoint is still covered by API test TC-A3 |

## 4. Test case table

### E2E (run on Chromium, Firefox and WebKit)

| ID | Feature | Type | Steps | Expected result |
|---|---|---|---|---|
| TC-L1 | Login | Positive | Log in as Bidder with valid credentials | Redirect to `/auctions`, "Live Auctions" shown |
| TC-L2 | Login | Negative | Valid email, wrong password | "Incorrect password." shown, stays on `/login` |
| TC-L3 | Login | Negative | Email with no account | "No account found with this email.", stays on `/login` |
| TC-R1 | Registration | Positive | Fill all fields as new Bidder, Register | Redirect to home, user saved in DB with role Bidder |
| TC-R2 | Registration | Negative | Register with an already-used email | Toast "User already registered.", stays on `/sign-up` |
| TC-R3 | Registration | Negative | Role Auctioneer, leave bank/payout details empty | Toast "Please provide your full bank details.", stays on `/sign-up`, no user in DB |
| TC-C1 | Create Auction | Positive | Fill all fields + image, Create | Toast "Auction item created" |
| TC-C2 | Create Auction | Negative | Auctioneer already has an active auction | Toast "You already have one active auction." |
| TC-C3 | Create Auction | Negative | Auctioneer owes commission | "Unpaid Commission" warning, Create button disabled |
| TC-B1 | Place Bid | Negative (boundary) | Enter starting bid − 1 | "Minimum bid is Rs. …" shown inline and as a toast, Bid button disabled |
| TC-B2 | Place Bid | Positive | Enter starting bid + 100, Bid | Shown as Current Bid |
| TC-B3 | Place Bid | Positive (state) | Same bidder bids +200 then +300 | Current bid updates; only **one** bid record in API |
| TC-P1 | Payment | Positive | Pay deposit with card 4242 4242 4242 4242 | Stripe → `/payment/success`, DB status "Paid" |
| TC-P2 | Payment | Negative | Pay with declined card 4000 0000 0000 0002 | Stripe shows "declined", DB status stays "Pending" |
| TC-P3 | Payment | Negative | Open a payment whose deadline passed | "Payment Deadline Expired", pay button disabled, server refuses to start a Stripe payment (400 "Payment deadline has passed") |

### API (Playwright `APIRequestContext`)

| ID | Operation | Request | Expected |
|---|---|---|---|
| TC-A1 | Create | `POST /auctionitem/create` (valid) / (no image) | 201 / 400 "Auction item image required." |
| TC-A2 | Read | `GET /auctionitem/auction/:id` (real) / (missing id) | 200 / 404 "Auction not found." |
| TC-A3 | Update | `PUT /superadmin/paymentproof/status/update/:id` (real) / (missing) | 200, status Rejected / 404 "Payment proof not found." |
| TC-A4 | Delete | `DELETE /auctionitem/delete/:id` then same id again | 200 / 404 "Auction not found." |

### Network mocking (`page.route`)

| ID | Mocked request | Mocked response | Expected |
|---|---|---|---|
| TC-N1 | `GET /auctionitem/allitems` | 200, `items: []` | "No auctions found" empty state |
| TC-N2 | `GET /auctionitem/allitems` | HTTP 500 | Page does not crash: heading shown, empty state, no JS errors |

## 5. Results

Full run (`pytest`, all browsers): **64 passed, 0 failed** in 6 min 55 s. Report: `reports/report.html` (screenshot of every test embedded).

| Group | Chromium | Firefox | WebKit | Total |
|---|---|---|---|---|
| E2E (6 features × 3) | 18 / 18 | 18 / 18 | 18 / 18 | 54 |
| Network mocking | 2 / 2 | 2 / 2 | 2 / 2 | 6 |
| API CRUD (no browser needed, run once) | – | – | – | 4 |
| **Total** | | | | **64 / 64 passed** |

## 6. Deliberate bugs

Two bugs were inserted on purpose. `bug_demo.py` inserts each one, runs the test that should catch it, removes the bug (always, even after a crash) and runs the test again.

```bash
python bug_demo.py             # both bugs
python bug_demo.py bid         # bug 1 only
python bug_demo.py payment     # bug 2 only
```

### Bug 1: a bid below the minimum is accepted

An off-by-one in the frontend minimum-bid check, `frontend/src/pages/AuctionItem.jsx`:

```js
if (numAmount < minBid) {          // correct: 999 is rejected when the minimum is 1000
if (numAmount < minBid - 1) {      // buggy:   999 is accepted, no error is shown
```

Caught by **TC-B1** `test_bid_below_minimum_shows_inline_error`, which enters starting bid − 1 = 999.

| Code | TC-B1 result | Report |
|---|---|---|
| bug inserted | **FAILED**: `Locator expected to be visible` ("Minimum bid is Rs." never appeared) | `reports/report_bid_bug.html` |
| bug removed | **PASSED** | `reports/report_bid_fixed.html` |

This is a boundary-value bug: a bid well below the minimum (e.g. 500) is still rejected, so only the test at *minimum − 1* exposes it.

### Bug 2: an expired payment can still be paid

The winning bidder has 12 hours to pay the 20% deposit. With this bug the bidder can still pay after the deadline. It is made of two realistic typos, one on each side:

```js
// frontend/src/pages/Payment/PaymentCheckout.jsx
const isExpired = timeLeft === "EXPIRED";     // correct
const isExpired = timeLeft === "Expired";     // buggy: never true, the Pay button stays enabled

// backend/controllers/paymentContoller.js  (createStripePaymentSession)
if (new Date() > payment.expiresAt) {         // correct: refuses with 400 "Payment deadline has passed"
if (new Date() > payment.expiryTime) {        // buggy: field does not exist, the deadline is never checked
```

With the bug, the checkout page shows "Time Remaining: EXPIRED" but still offers the Pay button, and the server returns a real Stripe checkout link for the expired payment.

Caught by **TC-P3** `test_expired_payment_cannot_be_paid`, which opens a payment whose deadline passed an hour ago. It checks the page (deadline banner, disabled button) and the server (creating a Stripe session must return 400).

| Code | TC-P3 result | Report |
|---|---|---|
| bug inserted | **FAILED**: `Locator expected to be visible` ("Payment Deadline Expired" never appeared) | `reports/report_payment_bug.html` |
| bug removed | **PASSED** | `reports/report_payment_fixed.html` |

## 7. Real bugs found by the tests

| # | Bug | Where | Found by | Status |
|---|---|---|---|---|
| 1 | Create Auction page calls `GET /user/unpaid-commission`, but that route did not exist in the backend (404), so the "Unpaid Commission" warning never appeared and the Create button stayed enabled | `frontend/src/pages/CreateAuction.jsx`, `backend/router/userRoutes.js` | TC-C3 | Fixed: route + `getUnpaidCommission` controller added |
| 2 | Payments were created with field `status` instead of `paymentStatus`; Mongoose silently dropped it, so payments had no status and could never be marked Paid/Expired correctly | `backend/services/paymentFlowService.js` | TC-P1 | Fixed |
| 3 | Payment history pushed `status` but the schema field is `Status` (dropped silently) | `backend/services/paymentFlowService.js` | TC-P1 | Fixed |
| 4 | Admin "Update proof" drawer showed the amount of the previously opened proof (stale state) | `frontend/src/pages/Dashboard/sub-components/PaymentProofs.jsx` | earlier commission test runs | Fixed |
| 5 | Commission cron called `sendEmail` without `await`, so a failed settlement email became an unhandled promise rejection instead of being caught | `backend/automation/verifyCommissionCron.js` | earlier commission test runs | Fixed |
| 6 | Typo `throw errorl` in the email error handler: any email failure crashed with `ReferenceError` instead of rethrowing the real error | `backend/utils/sendEmail.js` | earlier commission test runs | Fixed |
| 7 | Invalid input was blocked silently with no message: Sign-up with missing fields / bank details, a too-low bid and a commission proof without a file gave the user no error pop-up (proof form used a browser `alert`) | `SignUp.jsx`, `AuctionItem.jsx`, `SubmitCommission.jsx` | TC-R3, TC-B1 | Fixed: `toast.error(...)` pop-ups added |
| 8 | Quick Bid buttons show "+0k" on an auction that has no bids yet | `frontend/src/pages/AuctionItem.jsx` | TC-B1/B2 (observed) | Open (cosmetic) |

## 8. Work division

| Member | Part |
|---|---|
| MEMBER 1 | Features 1–2 (Login, Registration) E2E tests |
| MEMBER 2 | Features 3–4 (Create Auction, Place Bid) E2E tests + minimum-bid deliberate bug |
| MEMBER 3 | Feature 5 (Stripe Payment) E2E tests + expired-payment deliberate bug |
| MEMBER 4 | API CRUD tests, network mocking tests, cross-browser runs, HTML report |
