import fs from "fs";
import path from "path";

export function loadReferenceData() {
  const base = path.join(__dirname, "../../data");

  return {
    purchaseOrders: JSON.parse(
      fs.readFileSync(path.join(base, "purchase_orders.json"), "utf-8")
    ),
    deliveryNotes: JSON.parse(
      fs.readFileSync(path.join(base, "delivery_notes.json"), "utf-8")
    )
  };
}
