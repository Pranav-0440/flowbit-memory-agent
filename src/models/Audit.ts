export type AuditStep =
  | "recall"
  | "apply"
  | "decide"
  | "learn";

export interface AuditEntry {
  step: AuditStep;
  timestamp: string;
  details: string;
}
