// app/report/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import ReportClient from "./ReportClient";
import { requirePermission } from "@/lib/auth";

export default async function ReportPage() {
  const session = await requirePermission("ACCESS_REPORT");

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  let orders = [];
  let canExport = false; // ✅ Deklarasi benar

  try {
    const ordersRes = await fetch(`${API_URL}/api/orders`, {
      headers: {
        Authorization: `Bearer ${session.user?.backendToken || ""}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (ordersRes.ok) {
      const data = await ordersRes.json();
      orders = (data.data || []).filter((o: any) => o.status === "PAID");
    }

    canExport = session.user?.role === "admin"; // ✅ Perbaikan: bukan canPublish
  } catch (err) {
    console.error("Fetch orders error:", err);
    orders = [];
  }

  return <ReportClient orders={orders} currentUser={{
    id: session.user?.id || "",
    username: session.user?.username || "",
    role: session.user?.role || "cashier",
    backendToken: session.user?.backendToken || null
  }} canExport={canExport} />;
}
