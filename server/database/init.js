const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('📦 Connected to SQLite database');
    initDatabase();
  }
});

function initDatabase() {
  db.serialize(() => {
    // Certificates table
    db.run(`
      CREATE TABLE IF NOT EXISTS certificates (
        id TEXT PRIMARY KEY,
        learner_name TEXT NOT NULL,
        learner_email TEXT,
        course_name TEXT NOT NULL,
        institute_name TEXT NOT NULL,
        issue_date TEXT NOT NULL,
        certificate_hash TEXT UNIQUE NOT NULL,
        blockchain_tx_hash TEXT,
        pdf_path TEXT,
        qr_code TEXT,
        ipfs_hash TEXT,
        ipfs_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating certificates table:', err.message);
      } else {
        console.log('✅ Certificates table ready');
      }
    });

    // Institutes table
    db.run(`
      CREATE TABLE IF NOT EXISTS institutes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating institutes table:', err.message);
      } else {
        console.log('✅ Institutes table ready');
      }
    });
  });
}

module.exports = db;
