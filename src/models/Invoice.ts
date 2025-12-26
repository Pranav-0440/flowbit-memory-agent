export interface RawInvoice {
  invoiceId: string;
  vendor: string;
  invoiceNumber: string;
  invoiceDate: string;
  rawText: string;
  extractedFields: Record<string, any>;
}

export interface NormalizedInvoice {
  invoiceId: string;
  vendor: string;
  serviceDate?: string;
  currency?: string;
  totalAmount?: number;
  taxAmount?: number;
  lineItems?: Array<{
    description: string;
    sku?: string;
    quantity?: number;
    unitPrice?: number;
  }>;
}
