"""
DELIBERATE BUG DEMO — inserts a bug and runs the test that catches it,
so the test FAILS. The bug is removed again afterwards. There are two bugs.

  bid      Off-by-one in the minimum-bid check, on both sides, so a bid of 999 is placed:
           frontend/src/pages/AuctionItem.jsx
               correct:  if (numAmount < minBid) {        -> 999 is rejected (minimum is 1000)
               buggy:    if (numAmount < minBid - 1) {    -> 999 slips through, no error shown
           backend/controllers/bidController.js
               correct:  if (amount < auctionItem.startingBid) {
               buggy:    if (amount < auctionItem.startingBid - 1) {   -> server saves the 999 bid
           Caught by TC-B1  test_bid_below_minimum_shows_inline_error

  payment  Expired payments can still be paid. Two typos, one on each side:
           frontend/src/pages/Payment/PaymentCheckout.jsx
               correct:  const isExpired = timeLeft === "EXPIRED";
               buggy:    const isExpired = timeLeft === "Expired";      -> never true, Pay button stays enabled
           backend/controllers/paymentContoller.js
               correct:  if (new Date() > payment.expiresAt) {
               buggy:    if (new Date() > payment.expiryTime) {         -> undefined, deadline never checked
           Caught by TC-P3  test_expired_payment_cannot_be_paid

Steps for each bug:
  1. insert the bug
  2. run its test -> FAILS     (report: reports/report_<bug>_bug.html)
  3. remove the bug (always, even if something crashes)

Run (backend + frontend must be running; start the backend with "npm run dev"
so the backend half of the payment bug is reloaded automatically):
      python bug_demo.py               both bugs, visible browser
      python bug_demo.py payment       only the payment bug
      python bug_demo.py bid           only the bid bug
      python bug_demo.py --headless    no browser window
"""
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

TESTING = Path(__file__).resolve().parent
ROOT = TESTING.parent
BACKEND_HEALTH = "http://localhost:5000/api/v1/auctionitem/allitems"

BUGS = {
    "bid": {
        "title": "Bid below the minimum is accepted",
        "test": ("e2e/place_bid.py", "below_minimum", "TC-B1"),
        "edits": [
            (ROOT / "frontend/src/pages/AuctionItem.jsx",
             "    if (numAmount < minBid) {",
             "    if (numAmount < minBid - 1) { // DELIBERATE BUG (bug_demo.py): off-by-one"),
            (ROOT / "backend/controllers/bidController.js",
             "\n  if (amount < auctionItem.startingBid) {",
             "\n  if (amount < auctionItem.startingBid - 1) { // DELIBERATE BUG (bug_demo.py): off-by-one"),
        ],
    },
    "payment": {
        "title": "Expired payment can still be paid",
        "test": ("e2e/payment.py", "expired_payment", "TC-P3"),
        "edits": [
            (ROOT / "frontend/src/pages/Payment/PaymentCheckout.jsx",
             '  const isExpired = timeLeft === "EXPIRED";',
             '  const isExpired = timeLeft === "Expired"; // DELIBERATE BUG (bug_demo.py): wrong case'),
            (ROOT / "backend/controllers/paymentContoller.js",
             "    if (new Date() > payment.expiresAt) {",
             "    if (new Date() > payment.expiryTime) { // DELIBERATE BUG (bug_demo.py): wrong field"),
        ],
    },
}


def banner(text: str):
    print("\n" + "=" * 64)
    print(f"  {text}")
    print("=" * 64, flush=True)


def wait_for_reload(edits):
    time.sleep(3)  # Vite hot-reloads the frontend
    if any("backend" in str(f) for f, _, _ in edits):
        time.sleep(3)  # nodemon restarts the backend
        for _ in range(30):
            try:
                urllib.request.urlopen(BACKEND_HEALTH, timeout=2)
                return
            except Exception:
                time.sleep(1)
        print("  WARNING: backend not reachable on :5000")


def restore(edits):
    for path, correct, buggy in edits:
        source = path.read_text(encoding="utf-8")
        if buggy in source:
            path.write_text(source.replace(buggy, correct), encoding="utf-8")


def run_test(name: str, report: str) -> int:
    test_file, keyword, _ = BUGS[name]["test"]
    args = [sys.executable, "-m", "pytest", test_file, "-k", keyword,
            "-o", f"addopts=-v --screenshot on --output reports/test-results/{report}",
            "--browser", "chromium", "--no-header",
            "--html", f"reports/{report}.html", "--self-contained-html"]
    if "--headless" not in sys.argv:
        args += ["--headed", "--slowmo", "300"]
    return subprocess.run(args, cwd=TESTING).returncode


def demo(name: str) -> int:
    bug = BUGS[name]
    edits = bug["edits"]
    test_id = bug["test"][2]
    restore(edits)  # undo leftovers from an interrupted earlier run
    for path, correct, _ in edits:
        assert correct in path.read_text(encoding="utf-8"), f"Could not find the line to change in {path}"

    try:
        banner(f"[{name}] STEP 1  Inserting the bug: {bug['title']}")
        for path, correct, buggy in edits:
            print(f"  {path.relative_to(ROOT)}")
            print(f"    before: {correct.strip()}")
            print(f"    after : {buggy.strip()}")
            path.write_text(path.read_text(encoding="utf-8").replace(correct, buggy), encoding="utf-8")
        wait_for_reload(edits)

        banner(f"[{name}] STEP 2  Running {test_id} WITH the bug  (expected: FAILED)")
        with_bug = run_test(name, f"report_{name}_bug")
    finally:
        banner(f"[{name}] STEP 3  Removing the bug (files restored)")
        restore(edits)
    return with_bug


def main():
    chosen = [a for a in sys.argv[1:] if a in BUGS] or list(BUGS)
    results = {name: demo(name) for name in chosen}

    banner("SUMMARY")
    ok = True
    for name, with_bug in results.items():
        test_id = BUGS[name]["test"][2]
        print(f"  {name:8} {BUGS[name]['title']}  ({test_id})")
        print(f"           with the bug : {'FAILED  (bug caught by the test)' if with_bug else 'PASSED  (bug NOT caught!)'}")
        print(f"           report       : reports/report_{name}_bug.html")
        ok = ok and with_bug != 0
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
