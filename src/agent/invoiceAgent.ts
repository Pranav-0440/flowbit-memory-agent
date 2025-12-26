import { RawInvoice } from "../models/Invoice";
import { AgentOutput } from "../models/AgentOutput";
import { recallAgent } from "./recallAgent";
import { applyAgent } from "./applyAgent";
import { decisionAgent } from "./decisionAgent";
import { MemoryRecord } from "../models/Memory";
import fs from "fs";
import path from "path";

/* ---------- Load all invoices for duplicate detection ---------- */
const allInvoices = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../../data/invoices_extracted.json"),
    "utf-8"
  )
);

function isDuplicate(invoice: RawInvoice): boolean {
  return allInvoices.some(
    (inv: any) =>
      inv.vendor === invoice.vendor &&
      inv.fields?.invoiceNumber === invoice.extractedFields?.invoiceNumber &&
      inv.invoiceId !== invoice.invoiceId
  );
}

export function runInvoiceAgent(
  invoice: RawInvoice
): {
  output: AgentOutput;
  memoriesUsed: MemoryRecord[];
} {
  const auditTrail: any[] = [];

  /* ---------- DUPLICATE BLOCK ---------- */
  if (isDuplicate(invoice)) {
    return {
      output: {
        normalizedInvoice: {
          invoiceId: invoice.invoiceId,
          vendor: invoice.vendor
        },
        proposedCorrections: [],
        requiresHumanReview: true,
        reasoning:
          "Duplicate invoice detected (same vendor and invoice number). Escalated without learning.",
        confidenceScore: 0.3,
        memoryUpdates: [],
        auditTrail: [
          {
            step: "decide",
            timestamp: new Date().toISOString(),
            details: "Duplicate invoice detected; learning skipped"
          }
        ]
      },
      memoriesUsed: []
    };
  }

  /* ---------- RECALL (FOR EXPLANATION ONLY) ---------- */
  const recall = recallAgent(invoice);

  /* ---------- APPLY (SELF-RECALLS MEMORY) ---------- */
  const apply = applyAgent(invoice);

  /* ---------- DECIDE ---------- */
  const decision = decisionAgent(
    apply.proposedCorrections,
    apply.reasoning
  );

  const output: AgentOutput = {
    normalizedInvoice: apply.normalizedInvoice,
    proposedCorrections: apply.proposedCorrections,
    requiresHumanReview: decision.requiresHumanReview,
    reasoning:
      [...recall.reasoning, ...apply.reasoning, decision.reasoning].join(" | "),
    confidenceScore: decision.confidenceScore,
    memoryUpdates: [],
    auditTrail
  };

  return {
    output,
    memoriesUsed: recall.memories
  };
}
