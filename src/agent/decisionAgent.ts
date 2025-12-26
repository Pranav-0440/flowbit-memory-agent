import { AuditEntry } from "../models/Audit";
import dayjs from "dayjs";

export interface DecisionResult {
  requiresHumanReview: boolean;
  confidenceScore: number;
  reasoning: string;
  auditTrail: AuditEntry[];
}

export function decisionAgent(
  proposedCorrections: string[],
  reasoning: string[]
): DecisionResult {
  const auditTrail: AuditEntry[] = [];
  let requiresHumanReview = false;
  let decisionReason = "";

  if (proposedCorrections.length === 0) {
    decisionReason =
      "No unresolved issues detected. Invoice can be auto-accepted.";
  } else {
    requiresHumanReview = true;
    decisionReason =
      "Low-confidence or unresolved corrections exist. Human review required.";
  }

  auditTrail.push({
    step: "decide",
    timestamp: dayjs().toISOString(),
    details: decisionReason
  });

  // Simple confidence heuristic
  const confidenceScore =
    proposedCorrections.length === 0 ? 0.9 : 0.6;

  return {
    requiresHumanReview,
    confidenceScore,
    reasoning: decisionReason,
    auditTrail
  };
}
