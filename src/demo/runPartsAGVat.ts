import "../memory/memoryStore";
import { runInvoiceAgent } from "../agent/invoiceAgent";

const invoice = {
  invoiceId: "INV-B-001",
  vendor: "Parts AG",
  invoiceNumber: "PA-7781",
  invoiceDate: "2025-02-05",
  rawText: "Prices incl. VAT",
  extractedFields: {
    taxTotal: 400,
    grossTotal: 2400
  }
};

const result = runInvoiceAgent(invoice);
console.log(JSON.stringify(result.output, null, 2));
