import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(__dirname, "../../data/memory.db");

export const db = new Database(dbPath);

// Initialize tables
db.exec(`
CREATE TABLE IF NOT EXISTS memory (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  vendor TEXT,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  confidence REAL NOT NULL,
  usageCount INTEGER NOT NULL,
  createdAt TEXT NOT NULL,
  lastUsedAt TEXT
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  memoryId TEXT,
  step TEXT,
  timestamp TEXT,
  details TEXT
);
`);
