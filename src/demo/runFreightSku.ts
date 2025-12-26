import "../memory/memoryStore";
import { runInvoiceAgent } from "../agent/invoiceAgent";

const invoice = {
  invoiceId: "INV-C-002",
  vendor: "Freight & Co",
  invoiceNumber: "FC-1002",
  invoiceDate: "2025-03-10",
  rawText: "Service: Seefracht",
  extractedFields: {
    lineItems: [{ description: "Seefracht / Shipping" }]
  }
};

const result = runInvoiceAgent(invoice);
console.log(JSON.stringify(result.output, null, 2));
