const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

// Simple request logger to aid debugging (will log bodies for JSON requests)
app.use((req, res, next) => {
  try {
    console.log(`[REQ] ${req.method} ${req.url}`, req.body && Object.keys(req.body).length ? req.body : '');
  } catch (e) {
    // ignore logging errors
  }
  next();
});

app.post('/api/users', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'username required' });

  const query = `INSERT OR IGNORE INTO users (username) VALUES (?)`;
  db.run(query, [username], function(err) {
    if (err) {
      console.error('POST /api/users error:', err);
      return res.status(500).json({ error: err.message });
    }

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
      if (err) {
        console.error('GET user after insert error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ user: row });
    });
  });
});

app.post('/api/auth/signup', (req, res) => {
  try {
    console.log('POST /api/auth/signup body:', req.body);
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const hashed = bcrypt.hashSync(password, 8);
    const insert = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(insert, [username, hashed], function(err) {
      if (err) {
        console.error('POST /api/auth/signup db.run error:', err && err.message ? err.message : err);
        if (err.message && err.message.includes('UNIQUE')) return res.status(409).json({ error: 'username exists' });
        return res.status(500).json({ error: err.message });
      }
      db.get(`SELECT id, username, created_at FROM users WHERE id = ?`, [this.lastID], (err, row) => {
        if (err) {
          console.error('POST /api/auth/signup db.get error:', err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ user: row });
      });
    });
  } catch (err) {
    console.error('POST /api/auth/signup uncaught error:', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: err?.message || 'internal' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
      if (err) {
        console.error('POST /api/auth/login db.get error:', err);
        return res.status(500).json({ error: err.message });
      }
      if (!row) return res.status(401).json({ error: 'invalid credentials' });
      const ok = bcrypt.compareSync(password, row.password || '');
      if (!ok) return res.status(401).json({ error: 'invalid credentials' });

      res.json({ user: { id: row.id, username: row.username } });
    });
  } catch (err) {
    console.error('POST /api/auth/login uncaught error:', err);
    return res.status(500).json({ error: err?.message || 'internal' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, pid: process.pid });
});


app.post('/api/watchlist', (req, res) => {
  const { userId, movie } = req.body;
  if (!userId || !movie || !movie.id) return res.status(400).json({ error: 'userId and movie.id required' });

  const { id: movieId, title, poster } = movie;

  const insert = `INSERT INTO watchlist (user_id, movie_id, title, poster) VALUES (?, ?, ?, ?)`;
  db.run(insert, [userId, movieId, title || '', poster || ''], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, userId, movieId, title, poster });
  });
});

app.get('/api/watchlist/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = `SELECT movie_id as movieId, title, poster, created_at FROM watchlist WHERE user_id = ? ORDER BY created_at DESC`;
  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ watchlist: rows });
  });
});

app.delete('/api/watchlist/:userId/:movieId', (req, res) => {
  const { userId, movieId } = req.params;
  const del = `DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?`;
  db.run(del, [userId, movieId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

function startServer(port, attempts = 0, maxAttempts = 5) {
  const server = app.listen(port, '0.0.0.0', () => {
    const addr = server.address();
    try {
      const host = addr && addr.address ? addr.address : '0.0.0.0';
      const p = addr && addr.port ? addr.port : port;
      console.log(`GoWatch server listening on ${host}:${p}`);
    } catch (e) {
      console.log(`GoWatch server listening on port ${port}`);
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is in use.`);
      if (attempts < maxAttempts) {
        const nextPort = port + 1;
        console.log(`Trying port ${nextPort}... (attempt ${attempts + 1}/${maxAttempts})`);
        setTimeout(() => startServer(nextPort, attempts + 1, maxAttempts), 200);
      } else {
        console.error(`No available ports found after ${maxAttempts} attempts.`);
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

// Express error handler to catch any unhandled errors and log them
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err && err.stack ? err.stack : err);
  try { res.status(500).json({ error: err?.message || String(err) }); } catch (e) { /* noop */ }
});

startServer(PORT);
