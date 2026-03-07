const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.join(__dirname, "planner.db");
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  category TEXT,
  owner TEXT,
  due_date TEXT,
  priority TEXT,
  status TEXT,
  notes TEXT,
  vendor TEXT,
  estimated_cost REAL,
  paid_amount REAL
)
`);

module.exports = db;