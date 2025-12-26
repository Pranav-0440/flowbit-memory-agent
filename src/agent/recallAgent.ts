import { RawInvoice } from "../models/Invoice";
import { MemoryRecord } from "../models/Memory";
import { recallMemory, logAudit } from "../memory/memoryRepository";
import dayjs from "dayjs";

export interface RecallResult {
  memories: MemoryRecord[];
  reasoning: string[];
}

export function recallAgent(invoice: RawInvoice): RecallResult {
  const auditTime = dayjs().toISOString();

  // Recall vendor-specific memory
  const vendorMemories = recallMemory(invoice.vendor);

  logAudit(
    null,
    "recall",
    `Recalled ${vendorMemories.length} memories for vendor ${invoice.vendor}`
  );

  const reasoning: string[] = [];

  if (vendorMemories.length > 0) {
    reasoning.push(
      `Found ${vendorMemories.length} past learnings for vendor ${invoice.vendor}`
    );
  } else {
    reasoning.push(
      `No prior memory found for vendor ${invoice.vendor}`
    );
  }

  return {
    memories: vendorMemories,
    reasoning
  };
}
