const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'gowatch.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err);
    process.exit(1);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS watchlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      movie_id TEXT,
      title TEXT,
      poster TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  db.all(`PRAGMA table_info(users)`, (err, rows) => {
    if (err) {
      console.warn('Could not read users table info for migration:', err.message);
      return;
    }
    const hasPassword = rows && rows.some(r => r.name === 'password');
    const hasAvatarUrl = rows && rows.some(r => r.name === 'avatar_url');
    if (!hasPassword) {
      db.run(`ALTER TABLE users ADD COLUMN password TEXT`, (err) => {
        if (err) {
          console.warn('Could not add password column to users table:', err.message);
        } else {
          console.log('Migration: added password column to users table');
        }
      });
    }
    if (!hasAvatarUrl) {
      db.run(`ALTER TABLE users ADD COLUMN avatar_url TEXT`, (err) => {
        if (err) {
          console.warn('Could not add avatar_url column to users table:', err.message);
        } else {
          console.log('Migration: added avatar_url column to users table');
        }
      });
    }
  });
});

module.exports = db;
