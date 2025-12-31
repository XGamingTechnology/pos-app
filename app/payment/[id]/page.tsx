// app/payment/[id]/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import PaymentClient from "./PaymentClient";
import { requirePermission } from "@/lib/auth";

// ✅ PERBAIKAN: params adalah Promise, harus di-unwrap
export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ UNWRAP params dengan await
  const { id } = await params;

  const session = await getServerSession(authOptions);
  await requirePermission("ACCESS_ORDERS");

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  let order = null;

  try {
    // ✅ Gunakan id yang sudah di-unwrap
    const res = await fetch(`${API_URL}/api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${session?.user.backendToken}`,
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

  return <PaymentClient order={order} />;
}
