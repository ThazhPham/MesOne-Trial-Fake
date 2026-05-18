---
name: testing-mesone-ui
description: Test MesOne React UI login, dashboard, master pages, and account menu flows end-to-end.
---

# MesOne UI Testing

Use this skill when verifying MesOne frontend changes that require logging in, navigating the dashboard/sidebar, or testing the tabbar user account menu.

## Devin Secrets Needed

- `MESONE_TEST_USERNAME`: test login username for the remote MesOne API.
- `MESONE_TEST_PASSWORD`: test login password for the remote MesOne API.

If these secrets are not available, ask the user to provide temporary credentials or save reusable test credentials in Devin Secrets. Do not write real remote credentials into this skill.

## Local App Setup

1. Install dependencies if needed:
   ```bash
   npm install
   ```
2. Run the dev server from the repo root:
   ```bash
   npm run dev -- --host 0.0.0.0
   ```
3. Open Chrome to the Vite URL, usually:
   ```text
   http://localhost:5173/
   ```
4. The app calls the remote API server at `http://116.118.95.174:1115`. Confirm that server is reachable before debugging UI-only symptoms.

## Checks Before Browser Testing

Run these before creating or updating final testing evidence:

```bash
npm run lint
npm run build
```

The build may print DevExtreme bundle/license warnings. Treat them as caveats unless they block rendering or the flow under test.

## Login and Dashboard Flow

1. Clear old app state before a fresh login:
   ```js
   localStorage.clear();
   sessionStorage.clear();
   ```
2. Log in with the MesOne test account.
3. Confirm navigation reaches `/dashboard`.
4. Confirm localStorage contains the login API response fields needed by the UI:
   - `token` or `jwt_access_token`
   - `user`
   - `currentUser`
   - user display fields such as `userName`, `displayName`, `deptNm`, `role`, or `positionName`

## User Account Menu Flow

For account menu changes, verify:

1. The user box is aligned at the far right of the tabbar row.
2. The user box shows the login API user's name.
3. If the API provides role/position/department, the user box shows it below the name.
4. Clicking the user box opens a compact dropdown below it.
5. The dropdown contains `Đổi mật khẩu` and `Logout`.
6. `Đổi mật khẩu` opens a popup titled `Đổi mật khẩu` with three password fields and `Hủy` / `Lưu` buttons.
7. `Logout` returns to the login page and clears session keys including `token`, `user`, `currentUser`, `jwt_access_token`, `refresh_token`, and `rtoken`.

## Master Menu Smoke Tests

For master page changes, verify the sidebar opens the expected tab and does not show the empty placeholder:

- Item Master: menu `B009`, signature `191`, endpoint `/Masterdata/DataService/GetData`.
- BOM Master: menu `B011`, signature `189`, endpoint `/Masterdata/DataService/GetData`.

The BOM API may legitimately return zero rows. Treat no rows as a data caveat, not a UI failure, if the grid renders and the API response succeeds.

## Evidence

For browser-based testing, capture:

- Full-page screenshots of the dashboard/user state, dropdown, popup, and logout result.
- A screen recording when requested by the user or when testing visible UI behavior.
- A concise test report with pass/fail assertions and caveats.

When posting PR test results, include one PR comment with collapsed details and the main tested flow expanded.
