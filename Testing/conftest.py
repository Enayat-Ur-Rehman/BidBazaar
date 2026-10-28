"""
Root conftest: makes helpers.py / shared_config.py importable from the
e2e/, api/ and mocking/ folders, and embeds a screenshot of the final
browser state of every UI test (pass or fail) into the HTML report.
Also restyles the HTML report (report_style.css, Test case column).
"""
import base64
import html
from pathlib import Path

import pytest

from helpers import API_CALLS, SNAPS
from shared_config import FRONTEND_URL, BACKEND_API

# Visible (--headed) runs only: the screen here is 1366x768, so the
# 1280x720 test window shows the site very zoomed in. Zooming the page
# out (like pressing Ctrl + minus) shows the whole layout instead.
HEADED_ZOOM = 0.8


@pytest.fixture(autouse=True)
def zoom_out_when_watching(request, pytestconfig):
    if "page" in request.fixturenames and pytestconfig.getoption("headed"):
        page = request.getfixturevalue("page")
        # Full-height layouts (Tailwind h-screen / min-h-screen = 100vh) get
        # zoomed too and would leave an empty strip at the bottom, so they
        # are stretched by 1/zoom to still fill the window.
        css = (f"html{{zoom:{HEADED_ZOOM}}}"
               f".h-screen,.h-\\\\[100vh\\\\]{{height:calc(100vh / {HEADED_ZOOM})!important}}"
               f".min-h-screen{{min-height:calc(100vh / {HEADED_ZOOM})!important}}")
        page.add_init_script(
            "document.addEventListener('DOMContentLoaded', () => {"
            "const s = document.createElement('style');"
            f"s.textContent = '{css}';"
            "document.head.appendChild(s); });"
        )
    yield


# ------------------------------------------------------------ HTML report
# Readable test-case names for the "Test case" column of the report.
TEST_CASES = {
    "test_login_with_valid_credentials_redirects_bidder_to_auctions": ("TC-L1", "Valid login", "Positive"),
    "test_login_with_wrong_password_is_rejected": ("TC-L2", "Wrong password", "Negative"),
    "test_login_with_unregistered_email_is_rejected": ("TC-L3", "Unregistered email", "Negative"),
    "test_register_new_bidder_succeeds": ("TC-R1", "New Bidder registers", "Positive"),
    "test_register_with_existing_email_is_rejected": ("TC-R2", "Duplicate email", "Negative"),
    "test_register_auctioneer_without_bank_details_is_blocked": ("TC-R3", "Auctioneer without bank details", "Negative"),
    "test_create_auction_with_valid_data_succeeds": ("TC-C1", "Create a valid auction", "Positive"),
    "test_create_second_auction_while_one_is_active_is_rejected": ("TC-C2", "Second active auction", "Negative"),
    "test_create_auction_blocked_while_commission_is_unpaid": ("TC-C3", "Blocked by unpaid commission", "Negative"),
    "test_bid_below_minimum_shows_inline_error": ("TC-B1", "Bid below minimum (999 < 1000)", "Negative"),
    "test_valid_bid_is_accepted_and_shown_as_current_bid": ("TC-B2", "Valid bid accepted", "Positive"),
    "test_rebid_by_same_bidder_updates_existing_bid_not_a_new_one": ("TC-B3", "Re-bid updates the same bid", "Positive"),
    "test_payment_with_valid_test_card_succeeds": ("TC-P1", "Pay with valid card", "Positive"),
    "test_payment_with_declined_card_is_rejected": ("TC-P2", "Declined card", "Negative"),
    "test_expired_payment_cannot_be_paid": ("TC-P3", "Payment deadline expired", "Negative"),
    "test_admin_approves_commission_proof": ("TC-M1", "Admin approves proof", "Positive"),
    "test_admin_rejects_commission_proof": ("TC-M2", "Admin rejects proof", "Negative"),
    "test_submitting_more_than_owed_commission_is_rejected": ("TC-M3", "Proof larger than amount owed", "Negative"),
    "test_api_create_auction": ("TC-A1", "CREATE  POST /auctionitem/create", "API"),
    "test_api_read_auction": ("TC-A2", "READ  GET /auctionitem/auction/:id", "API"),
    "test_api_update_payment_proof_status": ("TC-A3", "UPDATE  PUT /superadmin/paymentproof/status/update/:id", "API"),
    "test_api_delete_auction": ("TC-A4", "DELETE  DELETE /auctionitem/delete/:id", "API"),
    "test_auctions_page_with_empty_data": ("TC-N1", "Mocked empty data", "Mocking"),
    "test_auctions_page_when_server_errors": ("TC-N2", "Mocked server error (500)", "Mocking"),
}
REPORT_CSS = Path(__file__).parent / "report_style.css"


@pytest.hookimpl(tryfirst=True)
def pytest_configure(config):
    if hasattr(config.option, "css") and str(REPORT_CSS) not in config.option.css:
        config.option.css.append(str(REPORT_CSS))


def pytest_html_report_title(report):
    name = Path(report.title).stem.replace("_", " ").title()
    report.title = f"BidBazaar Test Report: {name}"


def pytest_metadata(metadata, config):
    for key in list(metadata):
        if key not in ("Python", "Platform"):
            metadata.pop(key)
    browsers = config.getoption("browser", None) or ["chromium"]
    metadata["Browser"] = ", ".join(b.title() for b in browsers)
    metadata["Frontend"] = FRONTEND_URL
    metadata["Backend API"] = BACKEND_API
    metadata["Tool"] = "Playwright (Python) + pytest"


def pytest_html_results_table_header(cells):
    cells.insert(1, '<th class="sortable" data-column-type="testcase">Test case</th>')
    cells.insert(2, '<th>Type</th>')
    cells.pop()  # "Links" column: not used


def pytest_html_results_table_row(report, cells):
    func = report.nodeid.split("::")[-1].split("[")[0]
    tc_id, title, kind = TEST_CASES.get(func, ("", func, ""))
    cells.insert(1, f'<td class="col-testcase"><b>{tc_id}</b>&nbsp; {html.escape(title)}</td>')
    cells.insert(2, f'<td class="col-type"><span class="tag tag-{kind.lower()}">{kind}</span></td>')
    cells.pop()


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    if report.when != "call":
        return
    pytest_html = item.config.pluginmanager.getplugin("html")
    if pytest_html is None:
        return
    extras = getattr(report, "extras", [])

    # API tests: a table of every request and the status code it returned.
    calls = API_CALLS.get(item.nodeid)
    if calls:
        rows = "".join(
            f"<tr><td>{html.escape(c['case'])}</td><td><code>{html.escape(c['request'])}</code></td>"
            f"<td>{c['status']}</td><td>{c['expected']}</td><td>{html.escape(c['message'])}</td>"
            f"<td class='{'ok' if c['ok'] else 'bad'}'>{'PASS' if c['ok'] else 'FAIL'}</td></tr>"
            for c in calls)
        extras.append(pytest_html.extras.html(
            "<table class='api-calls'><tr><th>Case</th><th>Request</th><th>Response</th>"
            f"<th>Expected</th><th>Message</th><th>Result</th></tr>{rows}</table>"))

    # UI tests: the screenshots taken when each message was on screen,
    # plus the final screen (always for failures, which have no snap).
    page = item.funcargs.get("page")
    if page is not None:
        for label, path in SNAPS.get(item.nodeid, []):
            if Path(path).exists():
                extras.append(pytest_html.extras.png(
                    base64.b64encode(Path(path).read_bytes()).decode(), name=label))
        if report.failed or not SNAPS.get(item.nodeid):
            try:
                png = page.screenshot(full_page=False)
                extras.append(pytest_html.extras.png(base64.b64encode(png).decode(), name="final screen"))
            except Exception:
                pass
        extras.append(pytest_html.extras.html(f"<p class='final-url'>Final URL: <code>{html.escape(page.url)}</code></p>"))
    report.extras = extras
