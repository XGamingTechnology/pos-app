// app/orders/[id]/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import OrderDetailClient from "./OrderDetailClient"; // ✅ Pastikan path benar
import { requirePermission } from "@/lib/auth";

// ✅ JADIKAN async dan await params
export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ UNWRAP params dengan await
  const { id } = await params;

  // Proteksi RBAC
  const session = await requirePermission("ACCESS_ORDERS");

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  let order = null;

  try {
    const res = await fetch(`${API_URL}/api/orders/${id}`, {
      // ✅ Gunakan id yang sudah di-unwrap
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      order = data.data;
    }
  } catch (err) {
    console.error("Fetch order error:", err);
  }

  if (!order) {
    redirect("/orders");
  }

  return <OrderDetailClient order={order} />;
}
