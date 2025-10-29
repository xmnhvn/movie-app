const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'gowatch.db');
if (!fs.existsSync(dbPath)) {
  console.error('Database not found at', dbPath);
  process.exit(1);
}

const backupPath = path.join(__dirname, `gowatch.db.bak.${Date.now()}`);
fs.copyFileSync(dbPath, backupPath);
console.log('Backup created at', backupPath);

const db = new sqlite3.Database(dbPath);

const cleanupSql = `
PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;
DELETE FROM watchlist
WHERE id NOT IN (
  SELECT MAX(id) FROM watchlist GROUP BY user_id, movie_id
);
COMMIT;
PRAGMA foreign_keys = ON;
`;

db.exec(cleanupSql, (err) => {
  if (err) {
    console.error('Cleanup failed:', err);
    db.close();
    process.exit(1);
  }
  console.log('Duplicate watchlist rows removed (kept latest entry per user/movie).');

  db.get('SELECT COUNT(*) as cnt FROM watchlist', (e, row) => {
    if (!e) console.log('Remaining watchlist rows:', row.cnt);
    db.close();
  });
});
