import { NormalizedInvoice } from "./Invoice";
import { AuditEntry } from "./Audit";

export interface AgentOutput {
  normalizedInvoice: NormalizedInvoice;
  proposedCorrections: string[];
  requiresHumanReview: boolean;
  reasoning: string;
  confidenceScore: number;
  memoryUpdates: string[];
  auditTrail: AuditEntry[];
}
