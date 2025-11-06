const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.GOWATCH_JWT_SECRET || 'change-me-in-prod';

app.use(cors());
app.use(bodyParser.json());
// Serve user-uploaded content
const uploadsRoot = path.join(__dirname, 'uploads');
const avatarDir = path.join(uploadsRoot, 'avatars');
try { fs.mkdirSync(avatarDir, { recursive: true }); } catch {}
app.use('/uploads', express.static(uploadsRoot));

app.use((req, res, next) => {
  try {
    console.log(`[REQ] ${req.method} ${req.url}`, req.body && Object.keys(req.body).length ? req.body : '');
  } catch (e) {
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

    db.get(`SELECT id, username, created_at FROM users WHERE username = ?`, [username], (err, row) => {
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
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'password must be at least 6 characters' });
    }

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

        const token = jwt.sign({ id: row.id, username: row.username }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ user: row, token });
      });
    });
  } catch (err) {
    console.error('POST /api/auth/signup uncaught error:', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: err?.message || 'internal' });
  }
});

// NOTE: a single login handler with token issuance is defined below; the
// earlier/duplicate handler was removed to ensure clients receive the JWT.

// enhance login to return token as well
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

      const token = jwt.sign({ id: row.id, username: row.username }, JWT_SECRET, { expiresIn: '30d' });
      res.json({ user: { id: row.id, username: row.username }, token });
    });
  } catch (err) {
    console.error('POST /api/auth/login uncaught error:', err);
    return res.status(500).json({ error: err?.message || 'internal' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, pid: process.pid });
});

// Authentication middleware: verifies Authorization: Bearer <token>
function authenticateToken(req, res, next) {
  const auth = req.headers && req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'missing authorization header' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'invalid authorization header' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarDir);
  },
  filename: function (req, file, cb) {
    const userId = (req.user && req.user.id) || 'anon';
    const ext = (path.extname(file.originalname) || '').toLowerCase();
    const safeExt = ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext) ? ext : '.png';
    cb(null, `${userId}-${Date.now()}${safeExt}`);
  }
});
const upload = multer({ storage });

// Update user credentials (username, password)
app.put('/api/user', authenticateToken, (req, res) => {
  try {
    const userId = req.user && req.user.id;
    const { username, password } = req.body || {};
    if (!username && !password) return res.status(400).json({ error: 'no fields to update' });
    if (password && (typeof password !== 'string' || password.length < 6)) {
      return res.status(400).json({ error: 'password must be at least 6 characters' });
    }

    const doUpdate = () => {
      const fields = [];
      const params = [];
      if (username) { fields.push('username = ?'); params.push(username); }
      if (password) { fields.push('password = ?'); params.push(bcrypt.hashSync(password, 8)); }
      params.push(userId);
      const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      db.run(sql, params, function (err) {
        if (err) {
          if (err.message && err.message.includes('UNIQUE')) return res.status(409).json({ error: 'username exists' });
          return res.status(500).json({ error: err.message });
        }
        db.get(`SELECT id, username, avatar_url as avatarUrl, created_at FROM users WHERE id = ?`, [userId], (e2, row) => {
          if (e2) return res.status(500).json({ error: e2.message });
          return res.json({ user: row });
        });
      });
    };

    if (username) {
      db.get(`SELECT id FROM users WHERE username = ? AND id != ?`, [username, userId], (e, existing) => {
        if (e) return res.status(500).json({ error: e.message });
        if (existing) return res.status(409).json({ error: 'username exists' });
        doUpdate();
      });
    } else {
      doUpdate();
    }
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'internal' });
  }
});

// Upload or replace avatar
app.post('/api/user/avatar', authenticateToken, upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'avatar file required' });
    const userId = req.user && req.user.id;
    const publicPath = `/uploads/avatars/${req.file.filename}`;
    db.run(`UPDATE users SET avatar_url = ? WHERE id = ?`, [publicPath, userId], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get(`SELECT id, username, avatar_url as avatarUrl, created_at FROM users WHERE id = ?`, [userId], (e2, row) => {
        if (e2) return res.status(500).json({ error: e2.message });
        return res.json({ user: row });
      });
    });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'internal' });
  }
});

// Optional: remove avatar
app.delete('/api/user/avatar', authenticateToken, (req, res) => {
  try {
    const userId = req.user && req.user.id;
    db.get(`SELECT avatar_url FROM users WHERE id = ?`, [userId], (e, row) => {
      if (e) return res.status(500).json({ error: e.message });
      const current = row && row.avatar_url;
      db.run(`UPDATE users SET avatar_url = NULL WHERE id = ?`, [userId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        // try deleting old file (best-effort)
        if (current && current.startsWith('/uploads/')) {
          const abs = path.join(__dirname, current.replace('/uploads/', 'uploads/'));
          fs.unlink(abs, () => {});
        }
        db.get(`SELECT id, username, avatar_url as avatarUrl, created_at FROM users WHERE id = ?`, [userId], (e2, user) => {
          if (e2) return res.status(500).json({ error: e2.message });
          return res.json({ user });
        });
      });
    });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'internal' });
  }
});

// Delete current user and all related data
app.delete('/api/user', authenticateToken, (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Read current avatar to delete after DB cleanup
    db.get(`SELECT avatar_url FROM users WHERE id = ?`, [userId], (e, row) => {
      if (e) return res.status(500).json({ error: e.message });
      const currentAvatar = row && row.avatar_url;

      // Begin a simple transactional sequence
      db.run('BEGIN', (beginErr) => {
        if (beginErr) return res.status(500).json({ error: beginErr.message });

        db.run(`DELETE FROM watchlist WHERE user_id = ?`, [userId], function (delWErr) {
          if (delWErr) {
            return db.run('ROLLBACK', () => res.status(500).json({ error: delWErr.message }));
          }
          db.run(`DELETE FROM users WHERE id = ?`, [userId], function (delUErr) {
            if (delUErr) {
              return db.run('ROLLBACK', () => res.status(500).json({ error: delUErr.message }));
            }
            db.run('COMMIT', (commitErr) => {
              if (commitErr) return res.status(500).json({ error: commitErr.message });

              // Best-effort avatar file removal
              if (currentAvatar && currentAvatar.startsWith('/uploads/')) {
                const abs = path.join(__dirname, currentAvatar.replace('/uploads/', 'uploads/'));
                fs.unlink(abs, () => {});
              }

              // No content on success
              return res.status(204).end();
            });
          });
        });
      });
    });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'internal' });
  }
});

app.post('/api/watchlist', authenticateToken, (req, res) => {
  // Use the authenticated user id from the token; ignore any client-supplied userId.
  const userId = req.user && req.user.id;
  const { movie } = req.body;
  if (!userId || !movie || !movie.id) return res.status(400).json({ error: 'userId and movie.id required' });

  const { id: movieId, title, poster } = movie;

  const check = `SELECT id, movie_id as movieId, title, poster, created_at FROM watchlist WHERE user_id = ? AND movie_id = ?`;
  db.get(check, [userId, movieId], (err, row) => {
    if (err) {
      console.error('GET watchlist check error:', err);
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      return res.json({ saved: true, item: row });
    }

    const insert = `INSERT INTO watchlist (user_id, movie_id, title, poster) VALUES (?, ?, ?, ?)`;
    db.run(insert, [userId, movieId, title || '', poster || ''], function(err) {
      if (err) {
        console.error('POST /api/watchlist db.run error:', err);
        return res.status(500).json({ error: err.message });
      }
      db.get(`SELECT movie_id as movieId, title, poster, created_at FROM watchlist WHERE id = ?`, [this.lastID], (err2, newRow) => {
        if (err2) {
          console.error('GET watchlist after insert error:', err2);
          return res.status(500).json({ error: err2.message });
        }
        res.json({ saved: true, item: newRow });
      });
    });
  });
});

// Token-protected endpoints that use the authenticated user id from the token
app.get('/api/watchlist', authenticateToken, (req, res) => {
  const userId = req.user && req.user.id;
  const query = `SELECT movie_id as movieId, title, poster, MAX(created_at) as created_at FROM watchlist WHERE user_id = ? GROUP BY movie_id ORDER BY created_at DESC`;
  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ watchlist: rows });
  });
});

app.delete('/api/watchlist/:movieId', authenticateToken, (req, res) => {
  const { movieId } = req.params;
  const userId = req.user && req.user.id;
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
  return server;
}

app.use((err, req, res, next) => {
  // Always log the full stack server-side
  console.error('Unhandled server error:', err && err.stack ? err.stack : err);
  try {
    // Expose stack traces in development to help debugging requests from the frontend.
    const payload = { error: err?.message || String(err) };
    if (process.env.NODE_ENV !== 'production') {
      payload.stack = err && err.stack ? err.stack : undefined;
    }
    res.status(500).json(payload);
  } catch (e) { /* noop */ }
});

// When this file is executed directly, start the server.
// When required (e.g., from tests), export app and startServer without binding automatically.
if (require.main === module) {
  startServer(PORT);
}

module.exports = { app, startServer };
