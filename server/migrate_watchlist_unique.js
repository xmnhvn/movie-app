const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'gowatch.db');
if (!fs.existsSync(dbPath)) {
  console.error('Database not found at', dbPath);
  process.exit(1);
}

const backupPath = path.join(__dirname, `gowatch.db.migration.bak.${Date.now()}`);
fs.copyFileSync(dbPath, backupPath);
console.log('Backup created at', backupPath);

const db = new sqlite3.Database(dbPath);

// Perform migration: create new table with UNIQUE(user_id, movie_id), copy distinct rows (latest created_at), swap tables
const sql = `
PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

-- Create new table with UNIQUE constraint
CREATE TABLE IF NOT EXISTS watchlist_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  movie_id TEXT,
  title TEXT,
  poster TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  UNIQUE(user_id, movie_id)
);

-- Copy latest entry per user/movie into new table
INSERT OR IGNORE INTO watchlist_new (user_id, movie_id, title, poster, created_at)
SELECT user_id, movie_id, title, poster, MAX(created_at) as created_at
FROM watchlist
GROUP BY user_id, movie_id;

-- Drop old table
DROP TABLE IF EXISTS watchlist;

-- Rename new table to watchlist
ALTER TABLE watchlist_new RENAME TO watchlist;

COMMIT;
PRAGMA foreign_keys = ON;
`;

db.exec(sql, (err) => {
  if (err) {
    console.error('Migration failed:', err);
    console.error('DB backup is available at', backupPath);
    db.close();
    process.exit(1);
  }
  console.log('Migration completed successfully. Inspecting new schema and counts...');

  db.all("PRAGMA table_info('watchlist')", (e, cols) => {
    if (e) {
      console.warn('Could not read table info:', e);
    } else {
      console.log('watchlist columns:');
      console.table(cols.map(c => ({name: c.name, type: c.type, notnull: c.notnull, pk: c.pk, dflt_value: c.dflt_value}))); // okay in node console
    }

    db.get('SELECT COUNT(*) as cnt FROM watchlist', (err2, row) => {
      if (!err2) console.log('watchlist rows after migration:', row.cnt);
      db.all('SELECT movie_id, COUNT(*) as cnt FROM watchlist GROUP BY movie_id ORDER BY cnt DESC', (err3, grp) => {
        if (!err3) {
          console.log('group counts after migration:');
          console.table(grp);
        }
        db.close();
      });
    });
  });
});
