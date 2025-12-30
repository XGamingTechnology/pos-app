// app/orders/page.tsx
import { requirePermission } from "@/lib/auth";
import OrdersClient from "./OrdersClient";

export default async function OrdersPage() {
  // ✅ Proteksi di sisi server
  await requirePermission("ACCESS_ORDERS");

  return <OrdersClient />;
}
