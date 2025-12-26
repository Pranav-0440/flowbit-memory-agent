import { MemoryRecord } from "../models/Memory";
import { AuditEntry } from "../models/Audit";
import {
  updateMemoryConfidence,
  logAudit
} from "../memory/memoryRepository";
import dayjs from "dayjs";

export type HumanResolution =
  | "APPROVED"
  | "REJECTED"
  | "AUTO_REVERTED";

export interface LearningResult {
  memoryUpdates: string[];
  auditTrail: AuditEntry[];
}

export function learnAgent(
  memoriesUsed: MemoryRecord[],
  resolution: HumanResolution
): LearningResult {
  const memoryUpdates: string[] = [];
  const auditTrail: AuditEntry[] = [];

  for (const memory of memoriesUsed) {
    let delta = 0;

    switch (resolution) {
      case "APPROVED":
        delta = memory.confidence >= 0.8 ? 0.05 : 0.1;
        break;

      case "REJECTED":
        delta = -0.2;
        break;

      case "AUTO_REVERTED":
        delta = -0.3;
        break;
    }

    updateMemoryConfidence(Number(memory.id), delta);

    const updateMsg =
      `Memory ${memory.key} (${memory.type}) ` +
      `${delta > 0 ? "reinforced" : "weakened"} by ${delta}`;

    memoryUpdates.push(updateMsg);

    auditTrail.push({
      step: "learn",
      timestamp: dayjs().toISOString(),
      details: updateMsg
    });

    logAudit(
      Number(memory.id),
      "learn",
      updateMsg
    );
  }

  return {
    memoryUpdates,
    auditTrail
  };
}
