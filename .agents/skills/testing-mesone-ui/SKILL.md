---
name: testing-mesone-ui
description: Test the MesOne React/Vite UI end-to-end, especially sidebar menu pages that load data grids from the backend API.
---

# MesOne UI Testing

Use this skill when validating MesOne UI changes in `src/pages` or API client changes in `src/api/apiServer.js`.

## Devin Secrets Needed

- No persistent Devin secret is currently required if the login page still pre-fills usable development credentials.
- If pre-filled credentials are removed or stop working, request:
  - `MESONE_TEST_LOGIN_USERNAME`
  - `MESONE_TEST_LOGIN_PASSWORD`

## Local setup

1. Start the app from the repo root:
   ```bash
   npm run dev -- --host 0.0.0.0
   ```
2. Open `http://localhost:5173/` in Chrome.
3. The DevExpress evaluation banner may appear; it usually does not block navigation or data-grid testing.

## Login flow

1. Use the login form in the browser.
2. If username/password are already pre-filled by the app, submit those values.
3. Confirm the route changes to `/dashboard` and the dashboard sidebar/tab layout renders.

## Sidebar menu testing

1. Use the UI sidebar rather than directly navigating routes whenever verifying menu changes.
2. Expand the relevant menu group if needed.
3. Click the target menu item and confirm:
   - A tab opens with the expected label.
   - The page heading/content is visible.
   - The generic placeholder text `Chưa có nội dung.` is not shown for implemented pages.

## API-backed grid verification

For data-grid pages, collect both UI and API evidence:

1. Verify the grid headers and first visible rows in the UI.
2. Use browser/CDP evidence to confirm the expected backend endpoint appears in resource timing.
3. Confirm a token is present after login before checking authenticated API calls.
4. If needed, run a verification fetch from the page context using the same payload as the UI method; do not print the bearer token.

For Item Master specifically, expected evidence includes:

- Endpoint: `http://116.118.95.174:1115/Masterdata/DataService/GetData`
- Payload fields: `Signature: 191`, `FunctionCode: "GETDATA"`, `MenuCd: "B009"`
- Grid headers: `Item Code`, `Item Name`, `Group`
- Example first row values may include `A001`, `완제품A001`, and group `100`.

## Evidence to share

- Attach a full-screen recording when testing through browser/desktop UI.
- Attach a test report with inline full screenshots of the relevant before/after or final states.
- Include concise pass/fail assertions and any caveats such as missing CI checks or non-blocking license banners.
