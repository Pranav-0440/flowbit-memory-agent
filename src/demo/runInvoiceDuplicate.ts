import "../memory/memoryStore";
import { runInvoiceAgent } from "../agent/invoiceAgent";
import { RawInvoice } from "../models/Invoice";

/**
 * This invoice intentionally duplicates invoiceNumber
 * to demonstrate duplicate detection and learning block.
 */
const duplicateInvoice: RawInvoice = {
  invoiceId: "INV-A-004",
  vendor: "Supplier GmbH",
  invoiceNumber: "INV-2024-003",
  invoiceDate: "2025-01-26",
  rawText: "Rechnungsnr: INV-2024-003\nLeistungsdatum: 20.01.2024",
  extractedFields: {
    invoiceNumber: "INV-2024-003"
  }
};

const result = runInvoiceAgent(duplicateInvoice);

console.log("===== DUPLICATE INVOICE OUTPUT =====");
console.log(JSON.stringify(result.output, null, 2));
