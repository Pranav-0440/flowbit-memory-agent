export type MemoryType =
  | "VENDOR"
  | "CORRECTION"
  | "RESOLUTION"
  | "DUPLICATE";

export interface MemoryRecord {
  id: number;          // ✅ MUST be number (SQLite id)
  type: MemoryType;
  vendor: string;
  key: string;
  value: string;
  confidence: number;
  usageCount: number;
  createdAt: string;
}
