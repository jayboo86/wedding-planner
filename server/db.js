const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.join(__dirname, "planner.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT,
    owner TEXT,
    due_date TEXT,
    priority TEXT,
    status TEXT,
    notes TEXT,
    vendor TEXT,
    estimated_cost REAL DEFAULT 0,
    paid_amount REAL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;