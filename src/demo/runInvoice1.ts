import "../memory/memoryStore";
import { runInvoiceAgent } from "../agent/invoiceAgent";
import { RawInvoice } from "../models/Invoice";

const invoice1: RawInvoice = {
  invoiceId: "INV-A-001",
  vendor: "Supplier GmbH",
  invoiceNumber: "A-001",
  invoiceDate: "2025-12-01",
  rawText: "Leistungsdatum 01.12.2025",
  extractedFields: {}
};

const result = runInvoiceAgent(invoice1);

console.log("===== INVOICE #1 OUTPUT =====");
console.log(JSON.stringify(result.output, null, 2));

export const memoriesUsed = result.memoriesUsed;
