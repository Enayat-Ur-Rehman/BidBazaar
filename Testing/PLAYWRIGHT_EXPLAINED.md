# Playwright, Explained Simply

This file explains how our tests work: what Playwright is, the main ideas behind it, and every Playwright function we use and why.

---

## 1. What is Playwright?

Playwright is a tool that **controls a real web browser with code**. A test opens Chrome, Firefox or Safari (WebKit), goes to our website, types into boxes, clicks buttons, and then **checks that the website did the right thing**.

It works just like a person testing the site by hand, but it is fast, never gets bored, and can repeat the same steps on 3 browsers in a few minutes.

We use Playwright for Python, together with **pytest**:
- **Playwright** drives the browser.
- **pytest** finds the tests, runs them, and reports PASSED or FAILED.
- **pytest-playwright** connects the two, giving every test a ready-to-use browser page.
- **pytest-html** turns the results into an HTML report.

---

## 2. The main ideas

### 2.1 Browser, Context, Page

| Name | What it is | Real-life example |
|---|---|---|
| **Browser** | The browser program (Chromium, Firefox or WebKit) | Opening Chrome |
| **Context** | A fresh, private browser session with its own cookies | A new incognito window |
| **Page** | One tab inside that context | One tab showing our website |

pytest-playwright creates a new **context and page for every test**. So every test starts clean: no old login and no leftover cookies. Each test just asks for `page`:

```python
def test_login_with_wrong_password_is_rejected(page: Page):
    ...
```

### 2.2 Locators: finding things on the page

Before clicking or typing, Playwright must **find** the element. A **locator** describes how to find it. We find elements the way a user sees them, not by hidden HTML ids:

```python
page.get_by_placeholder("Enter your email")        # the box that shows "Enter your email"
page.get_by_role("button", name="Login")           # the button with the text "Login"
page.get_by_text("Incorrect password.")            # any element showing this text
```

This keeps tests stable. If a developer changes the HTML structure but the button still says "Login", the test still works.

### 2.3 Actions: doing things

When Playwright has found an element, it can act on it:

```python
page.get_by_placeholder("Enter your email").fill("ammar@gmail.com")   # type text
page.get_by_role("button", name="Login").click()                       # click
```

### 2.4 Auto-waiting: the most important idea

Websites are slow. Data loads from the server, pop-ups appear after a moment, and pages change.

Playwright **waits automatically**. Before clicking, it waits until the button is visible and enabled. Before checking a message, it keeps looking until the message appears or the time limit runs out. That is why our tests almost never need `sleep()`.

### 2.5 Assertions: checking the result

A test is only useful if it **checks** something. Playwright's `expect(...)` checks, and keeps retrying until the check passes or the time runs out:

```python
expect(page.get_by_text("Incorrect password.")).to_be_visible()   # the error is shown
expect(page).to_have_url(re.compile(r"/login$"))                 # we stayed on /login
expect(page.get_by_role("button", name="Bid")).to_be_disabled()  # the button is greyed out
```

If the check is still not true after the timeout, the test **FAILS**. That is how the deliberate bugs are caught.

We also use plain Python `assert` for things outside the page, such as a value in the database:

```python
assert get_payment_status(payment_id) == "Paid"
```

### 2.6 Fixtures: ready-made setup and cleanup (pytest)

A **fixture** is a function that prepares something before a test and cleans it up after. The test simply names it as a parameter.

```python
@pytest.fixture
def auctioneer_page(page):
    login_via_ui(...)          # BEFORE the test: log in as the Auctioneer
    yield page                 # the test runs here
    delete_active_auctions()   # AFTER the test: remove what the test created
```

The fixtures we use:
- `page`, `browser_name` and `playwright` come from pytest-playwright.
- `auctioneer_page`, `auction_id`, `make_payment`, `auctioneer_api` and `admin_api` are our own.

### 2.7 Three kinds of tests

| Kind | Folder | What it does | Playwright feature |
|---|---|---|---|
| **E2E** (end-to-end) | `e2e/` | Uses the real website like a user: browser, then frontend, then backend, then database | `page` |
| **API** | `api/` | Talks to the backend directly, with no browser, and checks the status codes (200, 201, 400, 404) | `APIRequestContext` |
| **Network mocking** | `network/` | Opens the real website but **replaces the server's answer** with a fake one (empty list, error 500) | `page.route()` |

---

## 3. Every Playwright function we use

### Opening pages and waiting
| Function | Purpose | Where we use it |
|---|---|---|
| `page.goto(url)` | Open a web address in the tab | Every E2E test, e.g. open `/login` |
| `page.goto(url, wait_until="domcontentloaded")` | Open the page, but don't wait for slow third-party scripts such as Stripe | `login.py`, `register.py`, `helpers.py` |
| `page.wait_for_url("**/auctions")` | Wait until the browser moves to a new address | After login, after payment |
| `page.wait_for_timeout(1500)` | Pause, only so a person watching can see the result | End of each test (`PAUSE_MS`) |
| `page.context.clear_cookies()` | Log out by deleting the session cookie | Before each login |

### Finding elements (locators)
| Function | Purpose | Example |
|---|---|---|
| `page.get_by_placeholder(text)` | Find an input by its grey hint text | `"Enter your email"` |
| `page.get_by_role(role, name=...)` | Find by type (button, heading, ...) and visible name | `get_by_role("button", name="Login")` |
| `page.get_by_text(text)` | Find any element showing this text | `"Incorrect password."` |
| `page.get_by_test_id(id)` | Find by a `data-testid` attribute | Stripe's Pay button |
| `page.locator(css)` | Find with a CSS selector, used when nothing else fits | `"#cardNumber"`, `".Toastify__toast"` |
| `.first` | Take the first match when several elements match | `get_by_text("Live Auctions").first` |
| `.nth(i)` | Take the match at position i | A table row |

### Actions
| Function | Purpose | Example |
|---|---|---|
| `.fill(text)` | Clear a box and type text | Email, password, bid amount |
| `.click()` | Click | Login, Register, Bid, Pay |
| `.click(force=True)` | Click even if something overlaps the element | Stripe's Pay button |
| `.select_option(value)` | Choose from a drop-down | Role: Bidder or Auctioneer |
| `.set_input_files(path)` | Upload a file | Auction image |
| `.wait_for(state="visible")` | Wait for one element to appear | Stripe's optional pop-up |

### Checks (assertions)
| Function | Checks that ... |
|---|---|
| `expect(locator).to_be_visible()` | the element can be seen (messages, headings) |
| `expect(locator).to_be_enabled()` | the button can be clicked |
| `expect(locator).to_be_disabled()` | the button is blocked (greyed out) |
| `expect(locator).to_have_value(text)` | an input contains this text |
| `expect(page).to_have_url(pattern)` | the browser is on this address |
| `timeout=15_000` | sets how long to keep retrying, in milliseconds (here, 15 seconds) |

### Screenshots and events
| Function | Purpose |
|---|---|
| `page.screenshot(path=...)` | Save a picture of the page. Our `snap()` helper calls it the moment a message appears. |
| `page.on("pageerror", fn)` | Listen for JavaScript crashes on the page (`server_error.py`) |

### API testing (no browser)
| Function | Purpose |
|---|---|
| `playwright.request.new_context()` | Create an "API client" that keeps its own login cookie |
| `request.get(url)` | Read data (the **R** in CRUD) |
| `request.post(url, form=... / multipart=...)` | Create data, log in, or upload a file (the **C** in CRUD) |
| `request.put(url, data=...)` | Update data (the **U** in CRUD) |
| `request.delete(url)` | Delete data (the **D** in CRUD) |
| `response.status` | The HTTP status code: 200 OK, 201 Created, 400 Bad Request, 404 Not Found |
| `response.json()` | The server's answer as a Python dictionary |
| `page.request.post(...)` | Same as above, but using the browser tab's login (used in TC-P3) |
| `request.dispose()` | Close the API client |

### Network mocking
| Function | Purpose |
|---|---|
| `page.route(url_pattern, handler)` | Catch every request the page sends to this address |
| `route.fulfill(status=..., body=...)` | Reply to the page with our fake answer, so the real server is never asked |
| `route.request.url` | The address the page tried to reach |

---

## 4. One test, step by step

`e2e/login.py`, test **TC-L2: wrong password**:

```python
def test_login_with_wrong_password_is_rejected(page: Page):
    submit_login_form(page, BIDDER["email"], "definitely-wrong-password")

    expect(page.get_by_text("Incorrect password.").first).to_be_visible(timeout=15_000)
    snap(page, "incorrect password error")
    expect(page).to_have_url(re.compile(r"/login$"))
```

What happens:
1. pytest starts the test and pytest-playwright hands it a fresh browser tab (`page`).
2. `submit_login_form` opens `/login`, types a real email with a **wrong** password, and clicks **Login**.
3. The website sends the login request to the backend, which answers "Incorrect password."
4. `expect(...).to_be_visible()` waits until the red error pop-up appears. If it never appears within 15 seconds, the test fails.
5. `snap(...)` saves a screenshot of the error for the report.
6. `expect(page).to_have_url(...)` checks that the user was **not** let in and is still on `/login`.
7. Every check passed, so pytest reports **PASSED**.

---

## 5. Our own helper functions (`helpers.py`)

These combine several Playwright steps into one readable call:

| Helper | What it does |
|---|---|
| `login_via_ui(page, email, password, url)` | Logs out, opens `/login`, fills the form, clicks Login, waits for the next page |
| `expect_toast(page, text)` | Checks that a pop-up message (toast) with this text appears |
| `snap(page, label)` | Takes a screenshot for the report at this exact moment |
| `fill_create_auction_form(...)` | Fills every field of the Create Auction form, including the image |
| `api_login(request, email, password)` | Logs an API client in |
| `api_create_auction(request, title, ...)` | Creates an auction through the API (used to prepare data quickly) |
| `delete_active_auctions(request)` | Removes the user's running auctions (cleanup) |
| `set_unpaid_commission(email, amount)` | Sets a value directly in MongoDB (setup) |
| `seed_pending_payment(...)` | Creates a payment that is waiting to be paid (setup) |
| `run_this_file(__file__)` | Lets you run any test file with `python login.py` |

**Setup vs. the real test:** we prepare data quickly through the API or the database, because that is setup and not what we are testing. The behaviour under test always goes through the real website, or the real API in `api/`.

---

## 6. Useful run options

| Option | Meaning |
|---|---|
| `--browser chromium/firefox/webkit` | Which browser engine to use (WebKit is Safari's engine) |
| `--headed` | Show the browser window (the default is hidden, called "headless") |
| `--slowmo 300` | Slow every action down by 300 ms so a person can follow it |
| `--screenshot on` | Save a screenshot at the end of every test |
| `--html reports/x.html` | Write an HTML report |
| `-k wrong_password` | Run only the tests whose name contains this word |
