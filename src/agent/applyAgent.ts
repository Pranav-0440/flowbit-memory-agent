import { RawInvoice, NormalizedInvoice } from "../models/Invoice";
import { MemoryRecord } from "../models/Memory";
import { AuditEntry } from "../models/Audit";
import { updateMemoryConfidence, logAudit, recallMemory } from "../memory/memoryRepository";
import dayjs from "dayjs";

export interface ApplyResult {
  normalizedInvoice: NormalizedInvoice;
  proposedCorrections: string[];
  reasoning: string[];
  auditTrail: AuditEntry[];
}

const AUTO_APPLY_THRESHOLD = 0.75;
const SUGGEST_THRESHOLD = 0.5;

export function applyAgent(invoice: RawInvoice): ApplyResult {
  // 🔥 ALWAYS recall fresh memory from DB
  const memories: MemoryRecord[] = recallMemory(invoice.vendor);

  const normalized: NormalizedInvoice = {
    invoiceId: invoice.invoiceId,
    vendor: invoice.vendor
  };

  const proposedCorrections: string[] = [];
  const reasoning: string[] = [];
  const auditTrail: AuditEntry[] = [];

  let memoryApplied = false;

  /* ======================================================
     1️⃣ MEMORY-BASED APPLICATION (TOP PRIORITY)
     ====================================================== */

  for (const memory of memories) {
    if (
      memory.type === "VENDOR" &&
      invoice.rawText.includes(memory.key)
    ) {
      const confidence = Number(memory.confidence.toFixed(2));

      if (confidence >= AUTO_APPLY_THRESHOLD) {
        (normalized as any)[memory.value] =
          extractValueFromText(invoice.rawText, memory.key);

        reasoning.push(
          `Auto-applied learned memory ${memory.key} → ${memory.value} (confidence ${confidence})`
        );

        updateMemoryConfidence(Number(memory.id), 0.05);
        memoryApplied = true;

        auditTrail.push({
          step: "apply",
          timestamp: dayjs().toISOString(),
          details: `Auto-applied memory ${memory.key}`
        });
      } else if (confidence >= SUGGEST_THRESHOLD) {
        proposedCorrections.push(
          `Suggest ${memory.key} → ${memory.value} based on prior learning`
        );

        reasoning.push(
          `Suggested learned memory ${memory.key} → ${memory.value} (confidence ${confidence})`
        );
      }
    }
  }

  /* ======================================================
     2️⃣ HEURISTICS (ONLY IF NO MEMORY AUTO-APPLIED)
     ====================================================== */

  if (!memoryApplied) {
    // Supplier GmbH – Leistungsdatum
    if (
      invoice.vendor === "Supplier GmbH" &&
      invoice.rawText.includes("Leistungsdatum") &&
      !invoice.extractedFields?.serviceDate
    ) {
      proposedCorrections.push(
        "Extract serviceDate from Leistungsdatum in rawText"
      );

      reasoning.push(
        "Heuristic triggered: Leistungsdatum detected without serviceDate"
      );
    }

    // Parts AG – VAT included
    if (
      invoice.vendor === "Parts AG" &&
      /MwSt\. inkl\.|Prices incl\. VAT/i.test(invoice.rawText)
    ) {
      proposedCorrections.push(
        "VAT included detected; recompute tax and gross totals"
      );

      reasoning.push(
        "Heuristic triggered: VAT already included in totals"
      );
    }

    // Parts AG – Currency recovery
    if (
      invoice.vendor === "Parts AG" &&
      !invoice.extractedFields?.currency &&
      /EUR|USD|INR/i.test(invoice.rawText)
    ) {
      proposedCorrections.push(
        "Recover missing currency from rawText"
      );

      reasoning.push(
        "Heuristic triggered: Currency detected in rawText"
      );
    }

    // Freight & Co – Skonto
    if (
      invoice.vendor === "Freight & Co" &&
      /Skonto/i.test(invoice.rawText)
    ) {
      proposedCorrections.push(
        "Detected Skonto payment terms"
      );

      reasoning.push(
        "Heuristic triggered: Skonto terms detected"
      );
    }

    // Freight & Co – SKU mapping
    invoice.extractedFields?.lineItems?.forEach((item: any, index: number) => {
      if (
        invoice.vendor === "Freight & Co" &&
        /Seefracht|Shipping/i.test(item.description || "")
      ) {
        proposedCorrections.push(
          `Map lineItems[${index}] description to SKU FREIGHT`
        );

        reasoning.push(
          "Heuristic triggered: Shipping description maps to FREIGHT SKU"
        );
      }
    });
  }

  logAudit(
    null,
    "apply",
    `Applied memory and heuristics to invoice ${invoice.invoiceId}`
  );

  return {
    normalizedInvoice: normalized,
    proposedCorrections,
    reasoning,
    auditTrail
  };
}

/* ---------- Simple explainable extractor ---------- */
function extractValueFromText(text: string, key: string): string {
  const index = text.indexOf(key);
  if (index === -1) return "";
  return text.substring(index + key.length).trim().split(" ")[0];
}
