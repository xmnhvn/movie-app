const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'gowatch.db');

try {
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Deleted existing DB:', dbPath);
  } else {
    console.log('No existing DB to delete at:', dbPath);
  }
} catch (err) {
  console.error('Failed to delete DB:', err.message);
  process.exit(1);
}

// Recreate tables by requiring the db module (it runs migrations on load)
try {
  require('./db');
  console.log('Recreated DB schema.');
  console.log('Reset complete. You can now start the server.');
} catch (err) {
  console.error('Failed to recreate DB schema:', err.message);
  process.exit(1);
}
