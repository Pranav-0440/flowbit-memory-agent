export type MemoryType =
  | "VENDOR"
  | "CORRECTION"
  | "RESOLUTION";

export interface MemoryRecord {
  id: string;
  type: MemoryType;
  vendor?: string;

  key: string;              // what pattern is stored
  value: string;            // normalized meaning / action

  confidence: number;       // 0 → 1
  usageCount: number;

  createdAt: string;
  lastUsedAt?: string;
}
