// app/report/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import ReportClient from "./ReportClient";
import { requirePermission } from "@/lib/auth";

export default async function ReportPage() {
  const session = await requirePermission("ACCESS_REPORT");

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  let orders = [];
  let canExport = false;

  try {
    // ✅ GUNAKAN ENDPOINT YANG FLEKSIBEL UNTUK FILTER
    const url = new URL(`${API_URL}/api/admin/reports/orders`);
    url.searchParams.set("period", "all");

    const ordersRes = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${session.user?.backendToken || ""}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (ordersRes.ok) {
      const data = await ordersRes.json();
      orders = data.success ? data.data : [];
    }

    canExport = session.user?.role === "admin";
  } catch (err) {
    console.error("Fetch orders error:", err);
    orders = [];
  }

  return (
    <ReportClient
      orders={orders}
      currentUser={{
        id: session.user?.id || "",
        username: session.user?.username || "",
        role: session.user?.role || "cashier",
        backendToken: session.user?.backendToken || null,
      }}
      canExport={canExport}
    />
  );
}
