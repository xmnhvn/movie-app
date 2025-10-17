# GoWatch Server

This is a minimal Express + SQLite backend for GoWatch. It provides endpoints to create users and manage a user's watchlist.

Quick start:

1. cd server
2. npm install
3. npm run start

API:
- POST /api/users { username }
- POST /api/watchlist { userId, movie: { id, title, poster } }
- GET /api/watchlist/:userId
- DELETE /api/watchlist/:userId/:movieId

The server stores data in `server/gowatch.db` (SQLite).
