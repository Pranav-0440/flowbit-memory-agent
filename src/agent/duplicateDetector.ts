export function isDuplicate(invoice: any, allInvoices: any[]) {
  return allInvoices.some(
    inv =>
      inv.vendor === invoice.vendor &&
      inv.fields?.invoiceNumber === invoice.fields?.invoiceNumber &&
      inv.invoiceId !== invoice.invoiceId
  );
}
