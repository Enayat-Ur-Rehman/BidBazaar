"""
DELIBERATE BUG DEMO — shows a test FAILING because of a bug, then
PASSING again once the bug is removed.

The bug: an off-by-one in the frontend's minimum-bid check
(frontend/src/pages/AuctionItem.jsx):

    correct:  if (numAmount < minBid) {          -> 999 is rejected (minimum is 1000)
    buggy:    if (numAmount < minBid - 1) {      -> 999 slips through, no error shown

Test that catches it: TC-B1  test_bid_below_minimum_shows_inline_error

Steps:
  1. insert the bug into AuctionItem.jsx
  2. run TC-B1 -> FAILS     (report: reports/report_with_bug.html)
  3. remove the bug (always, even if something crashes)
  4. run TC-B1 -> PASSES    (report: reports/report_bug_fixed.html)

Run (backend + frontend must be running):
      python bug_demo.py               visible browser
      python bug_demo.py --headless
"""
import subprocess
import sys
import time
from pathlib import Path

TESTING = Path(__file__).resolve().parent
TARGET = TESTING.parent / "frontend" / "src" / "pages" / "AuctionItem.jsx"
CORRECT = "    if (numAmount < minBid) {"
BUGGY = "    if (numAmount < minBid - 1) { // DELIBERATE BUG (bug_demo.py): off-by-one"
TEST = "e2e/place_bid.py"


def banner(text: str):
    print("\n" + "=" * 64)
    print(f"  {text}")
    print("=" * 64, flush=True)


def run_test(report_name: str) -> int:
    args = [sys.executable, "-m", "pytest", TEST, "-k", "below_minimum",
            "-o", f"addopts=-v --screenshot on --output reports/test-results/{report_name[:-5]}",
            "--browser", "chromium", "--no-header",
            "--html", f"reports/{report_name}", "--self-contained-html"]
    if "--headless" not in sys.argv:
        args += ["--headed", "--slowmo", "300"]
    return subprocess.run(args, cwd=TESTING).returncode


def main():
    source = TARGET.read_text(encoding="utf-8")
    if BUGGY in source:  # left over from an interrupted earlier run
        source = source.replace(BUGGY, CORRECT)
        TARGET.write_text(source, encoding="utf-8")
    assert CORRECT in source, f"Could not find the minimum-bid check in {TARGET}"

    try:
        banner("STEP 1  Inserting the bug into AuctionItem.jsx")
        print(f"  before: {CORRECT.strip()}")
        print(f"  after : {BUGGY.strip()}")
        TARGET.write_text(source.replace(CORRECT, BUGGY), encoding="utf-8")
        time.sleep(3)  # let Vite hot-reload the change

        banner("STEP 2  Running TC-B1 WITH the bug  (expected: FAILED)")
        with_bug = run_test("report_with_bug.html")
    finally:
        banner("STEP 3  Removing the bug (AuctionItem.jsx restored)")
        TARGET.write_text(source, encoding="utf-8")
        time.sleep(3)

    banner("STEP 4  Running TC-B1 WITHOUT the bug  (expected: PASSED)")
    without_bug = run_test("report_bug_fixed.html")

    banner("SUMMARY")
    print(f"  with the bug    : {'FAILED  (bug caught by the test)' if with_bug else 'PASSED  (bug NOT caught!)'}")
    print(f"  without the bug : {'PASSED' if without_bug == 0 else 'FAILED'}")
    print("  reports         : reports/report_with_bug.html, reports/report_bug_fixed.html")
    sys.exit(0 if with_bug != 0 and without_bug == 0 else 1)


if __name__ == "__main__":
    main()
