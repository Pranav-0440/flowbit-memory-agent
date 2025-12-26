export function matchPO(invoice: any, purchaseOrders: any[]) {
  // Safety checks
  if (
    !invoice?.extractedFields?.lineItems ||
    !Array.isArray(invoice.extractedFields.lineItems)
  ) {
    return null;
  }

  const candidates = purchaseOrders.filter(po =>
    po.vendor === invoice.vendor &&
    Array.isArray(po.lineItems) &&
    po.lineItems.some((poItem: any) =>
      invoice.extractedFields.lineItems.some(
        (invItem: any) =>
          invItem.sku === poItem.sku &&
          invItem.qty === poItem.qty
      )
    )
  );

  return candidates.length === 1 ? candidates[0] : null;
}
