import Database from "better-sqlite3";
import { MemoryRecord, MemoryType } from "../models/Memory";


const db = new Database("data/memory.db");

/* ------------------ Init Table ------------------ */
db.prepare(`
  CREATE TABLE IF NOT EXISTS memory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    vendor TEXT,
    key TEXT,
    value TEXT,
    confidence REAL,
    usageCount INTEGER DEFAULT 0,
    createdAt TEXT
  )
`).run();

/* ------------------ Create Memory ------------------ */
export function createMemory(
  type: MemoryType,
  vendor: string,
  key: string,
  value: string,
  confidence: number
): void {
  db.prepare(`
    INSERT INTO memory (type, vendor, key, value, confidence, usageCount, createdAt)
    VALUES (?, ?, ?, ?, ?, 1, datetime('now'))
  `).run(type, vendor, key, value, confidence);
}

/* ------------------ Recall Memory ------------------ */
export function recallMemory(vendor: string): MemoryRecord[] {
  return db
    .prepare(`SELECT * FROM memory WHERE vendor = ?`)
    .all(vendor)
    .map((row: any) => ({
      ...row,
      id: Number(row.id)   // ✅ critical fix
    }));
}

/* ------------------ Update Confidence ------------------ */
export function updateMemoryConfidence(
  id: number | string,
  delta: number
): void {
  db.prepare(`
    UPDATE memory
    SET confidence = MIN(1.0, MAX(0.0, confidence + ?)),
        usageCount = usageCount + 1
    WHERE id = ?
  `).run(delta, Number(id));
}


/* ------------------ Get Memories By Vendor ------------------ */
export function getMemoriesByVendor(vendor: string): MemoryRecord[] {
  return db
    .prepare(`SELECT * FROM memory WHERE vendor = ?`)
    .all(vendor)
    .map((row: any) => ({
      ...row,
      id: Number(row.id)   // ✅ critical fix
    }));
}

/* ------------------ Audit (Optional) ------------------ */
export function logAudit(
  memoryId: number | null,
  step: string,
  details: string
): void {
  // For demo: logging only
  // Can be extended to persistent audit table
}
