---
name: testing-mesone-ui
description: Test the MesOne Vite UI end-to-end. Use when verifying login, dashboard/menu DOM loading, Item/BOM master grids, user account dropdowns, popups, or logout flows.
---

# MesOne UI Testing

## Devin Secrets Needed

- `MESONE_TEST_USERNAME`: username for the MesOne test backend.
- `MESONE_TEST_PASSWORD`: password for the MesOne test backend.

If the login page has safe seeded defaults, they may be used for local testing. Do not commit real backend credentials into this skill.

## Local Setup

1. Install dependencies if needed:
   ```bash
   npm install
   ```
2. Run local checks before browser testing:
   ```bash
   npm run lint
   npm run build
   ```
3. Start the app:
   ```bash
   npm run dev -- --host 0.0.0.0
   ```
4. Open Chrome to `http://localhost:5173/` and maximize the window before recording.

## Recommended Recording

Use screen recording for UI tests because the main value is visual proof of menu/dropdown/popup behavior.

Example:
```bash
ffmpeg -y -video_size 1024x768 -framerate 15 -f x11grab -i :0.0 -codec:v libx264 -preset ultrafast -pix_fmt yuv420p /home/ubuntu/test-artifacts/mesone-ui-e2e.mp4
```

Stop with `q` after the test completes.

## Core Flow to Test

1. Clear stale browser state if previous auth may interfere.
2. Log in and verify the URL reaches `/dashboard`.
3. Verify the dashboard DOM has:
   - sidebar menu,
   - tabbar,
   - Dashboard tab,
   - right-aligned user account control.
4. Open Master → Item and verify `Item Master` renders a DevExtreme grid with server rows.
5. Open Master → BOM and verify `BOM Master` renders a DevExtreme grid. If the server returns no rows, report that as a caveat instead of claiming BOM data rendering is fully proven.
6. Click the user account control and verify a compact dropdown opens directly below it.
7. Verify the dropdown contains only the intended actions, such as `Đổi mật khẩu` and `Logout`.
8. Click `Đổi mật khẩu` and verify the popup appears with password fields and action buttons.
9. Click `Logout` and verify the login page is visible again.

## Reporting Guidance

- Include screenshots for Item grid, BOM grid, user dropdown, password popup, and logout/login state.
- Be conservative: if a backend returns no rows, mark real-row rendering as untested even if the grid DOM renders correctly.
- Mention the DevExtreme evaluation banner if it appears, but only treat it as a blocker if it prevents interaction.
