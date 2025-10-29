
# GoWatch (Movie App)

A simple movie browsing app with sign up/login and a per-user watchlist. This is intended for a school project and local use only.

## Prerequisites

- Node.js 18+ recommended
- Windows PowerShell or any terminal

## Install

```powershell
npm install
npm install --prefix server
```

## Run (recommended)

```powershell
npm run dev
```

This starts:
- API server on http://localhost:8000 (auto-increments if busy)
- Frontend dev server on http://localhost:3000 (or the next open port)

Open the browser, create an account or log in, and add movies to your watchlist.

Tip: If the server moves to a different port (e.g., 8001), set an override for the frontend API base.

1) Copy `.env.example` to `.env`

```powershell
cp .env.example .env
```

2) Adjust `VITE_API_URL` in `.env` to the actual server URL, e.g.,

```
VITE_API_URL=http://localhost:8001
```

## Build and Preview (optional)

```powershell
npm run build
npm run preview
```

Preview serves the built frontend from the `build/` folder. The API server still needs to be running (use `npm run start:server`).

## Handy scripts

- Start only the backend server (from project root):
  ```powershell
  npm run start:server
  ```

- Reset local database (deletes `server/gowatch.db` and recreates tables):
  ```powershell
  npm run reset-db
  ```

- API smoke test (starts API, tests signup/login/watchlist, shuts down):
  ```powershell
  node server/test_api.js
  ```

## Troubleshooting

- If auth/watchlist fails in the UI, make sure the backend server is running and listening on the port printed in the terminal.
- The frontend dev server proxies `/api` to `http://localhost:8000` (see `vite.config.ts`). If the server picked a different port because 8000 was busy, restart it or update the proxy temporarily.
- Clear stale local storage if needed (Browser DevTools Console):
  ```js
  localStorage.removeItem('gowatch_user');
  localStorage.removeItem('gowatch_token');
  ```

## Security note

JWT secret defaults to a development value. For this school project it’s fine. Do not deploy as-is.

  