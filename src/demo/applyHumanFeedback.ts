import "../memory/memoryStore";
import {
  getMemoriesByVendor,
  createMemory,
  updateMemoryConfidence
} from "../memory/memoryRepository";
import { MemoryRecord } from "../models/Memory";
import dayjs from "dayjs";

console.log("===== HUMAN FEEDBACK APPLIED =====");

const vendor = "Supplier GmbH";
const key = "Leistungsdatum";   // MUST match rawText trigger
const value = "serviceDate";

/* 1️⃣ Load existing memories */
const memories: MemoryRecord[] = getMemoriesByVendor(vendor);

/* 2️⃣ Check if memory already exists */
const existing = memories.find(
  (m: MemoryRecord) => m.key === key && m.value === value
);

if (!existing) {
  /* 3️⃣ First-time human approval → STRONG memory */
  createMemory(
    "VENDOR",
    vendor,
    key,
    value,
    0.8
  );

  console.log({
    memoryUpdates: [
      `Memory ${key} (VENDOR) created with confidence 0.8`
    ],
    auditTrail: [
      {
        step: "learn",
        timestamp: dayjs().toISOString(),
        details: `New high-confidence memory created for ${key} → ${value}`
      }
    ]
  });
} else {
  /* 4️⃣ Human approval overrides weak learning */
  const delta = Math.max(0.8 - existing.confidence, 0);

  updateMemoryConfidence(
    Number(existing.id),
    delta
  );

  console.log({
    memoryUpdates: [
      `Memory ${key} promoted to high confidence via human approval`
    ],
    auditTrail: [
      {
        step: "learn",
        timestamp: dayjs().toISOString(),
        details: `Memory ${key} confidence promoted to ≥ 0.8`
      }
    ]
  });
}
