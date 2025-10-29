const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'gowatch.db');
const db = new sqlite3.Database(dbPath, (err) => { if (err) { console.error('DB open error', err); process.exit(1); } });

db.all('SELECT id, user_id, movie_id, title, poster, created_at FROM watchlist ORDER BY created_at DESC', (err, rows) => {
  if (err) { console.error('query error', err); db.close(); process.exit(1); }
  console.log('watchlist rows:', rows.length);
  rows.forEach(r => console.log(r));
  // show grouping counts
  db.all('SELECT movie_id, COUNT(*) as cnt FROM watchlist GROUP BY movie_id ORDER BY cnt DESC', (e, grp) => {
    if (!e) {
      console.log('\ngroup counts:');
      grp.forEach(g => console.log(g));
    }
    db.close();
  });
});
