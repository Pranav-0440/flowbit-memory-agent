import "../memory/memoryStore";
import { recallAgent } from "../agent/recallAgent";
import { applyAgent } from "../agent/applyAgent";
import { RawInvoice } from "../models/Invoice";

const invoice: RawInvoice = {
  invoiceId: "INV-A-003",
  vendor: "Supplier GmbH",
  invoiceNumber: "A-003",
  invoiceDate: "2025-12-10",
  rawText: "Leistungsdatum 10.12.2025",
  extractedFields: {}
};

const recall = recallAgent(invoice);
const apply = applyAgent(invoice, recall.memories);

console.log("APPLY RESULT:");
console.log(JSON.stringify(apply, null, 2));
