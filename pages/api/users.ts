import type { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'server', 'gowatch.db');
const db = new sqlite3.Database(dbPath);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
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
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
