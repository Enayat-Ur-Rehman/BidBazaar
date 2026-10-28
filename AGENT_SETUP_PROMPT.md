Set up and run the BidBazaar project, which I've just extracted from a zip into this folder.

Start by reading SETUP_AND_TESTING_GUIDE.md in the project root. It describes:
- the prerequisites
- where everything lives
- the configuration files
- install commands
- how to create the test accounts
- how to start the app and run the tests
- a troubleshooting table

Follow it in order:

1. **Prerequisites (guide section 1):** check that Node.js 22, Python 3.12 and a local MongoDB on port 27017 are installed and running.
   - Tell me what's missing before installing anything system-wide.
2. **Configuration (section 3):** check backend/config/config.env and frontend/.env.
   - If MONGO_URI has a username and password but my local MongoDB has no authentication, change it to mongodb://localhost:27017.
   - If the Cloudinary or Stripe keys are missing or empty, stop and ask me for them.
   - Never print secret values.
3. **Install (section 4):** install backend, frontend and Testing dependencies, including Playwright's browsers.
   - If node_modules folders came from the zip, delete and reinstall them.
4. **Test accounts (section 5):** run `node seedTestAccounts.js` in backend/.
5. **Start the app (section 6):** start the backend (npm start) and the frontend (npm run dev) as long-running background processes.
   - Confirm "Connected to database." in the backend log and that http://localhost:5173 responds.
6. **Smoke test (section 7):** in Testing/, run the four API files: api/create.py, api/read.py, api/update.py and api/delete.py.
   - Run each one with `python <file> --headless`.
   - Then run e2e/login.py with `python e2e/login.py chromium --headless`.
   - If these pass, run the full suite with `pytest`. It takes about 7 minutes and should show 64 passed.

Rules:
- Never run two test commands at the same time. All tests share the same database accounts, so parallel runs cause false failures.
- Don't change test files, the guide or application code to make a test pass.
- If a test fails:
  - Check the troubleshooting table in section 8 first.
  - If it's an environment problem (keys, ports, accounts, an interrupted run), fix it and re-run only that file.
  - Report any other failure to me with the error message. Don't patch it.
- Don't run `python bug_demo.py` unless I ask. It edits frontend/src/pages/AuctionItem.jsx on purpose (and restores it).

When you're done, give me a short summary:
- what you installed or changed
- whether the backend and frontend are running, and on which ports
- the test results: passed / failed per file, and the full-suite total
- where the HTML reports are (Testing/reports/*.html; open them in a web browser)
- anything I still need to do by hand
