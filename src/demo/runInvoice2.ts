import "../memory/memoryStore";
import { runInvoiceAgent } from "../agent/invoiceAgent";
import { RawInvoice } from "../models/Invoice";

const invoice2: RawInvoice = {
  invoiceId: "INV-A-003",
  vendor: "Supplier GmbH",
  invoiceNumber: "A-003",
  invoiceDate: "2025-12-10",
  rawText: "Leistungsdatum 10.12.2025",
  extractedFields: {}
};

const result = runInvoiceAgent(invoice2);

console.log("===== INVOICE #2 OUTPUT (AFTER LEARNING) =====");
console.log(JSON.stringify(result.output, null, 2));
