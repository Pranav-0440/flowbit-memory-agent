import "../memory/memoryStore";
import { runInvoiceAgent } from "../agent/invoiceAgent";

const invoice = {
  invoiceId: "INV-B-003",
  vendor: "Parts AG",
  invoiceNumber: "PA-7810",
  invoiceDate: "2025-03-03",
  rawText: "Currency: EUR",
  extractedFields: {
    currency: null
  }
};

const result = runInvoiceAgent(invoice);
console.log(JSON.stringify(result.output, null, 2));
