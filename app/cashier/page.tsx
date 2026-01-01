// app/cashier/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import CashierClient from "./CashierClient";
import { ROLES } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default async function CashierPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  // ✅ Unwrap searchParams untuk Next.js 15+
  const { edit: editOrderId } = await searchParams;

  const session = await getServerSession(authOptions);

  // ✅ Proteksi RBAC
  const allowedRoles = [ROLES.CASHIER, ROLES.ADMIN];
  const userRole = session?.user?.role;
  const hasValidUser = session?.user && session.user.id && session.user.username && session.user.backendToken;

  if (!session || !hasValidUser || !userRole || !allowedRoles.includes(userRole as any)) {
    return redirect("/login");
  }

  let products = [];
  let initialOrder = null;

  try {
    // ✅ Ambil daftar produk
    const productsRes = await fetch(`${API_URL}/api/products`, {
      headers: {
        Authorization: `Bearer ${session.user?.backendToken || ""}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (productsRes.ok) {
      const result = await productsRes.json();
      if (result.success && Array.isArray(result.data)) {
        products = result.data;
      }
    }

    // ✅ Jika ada parameter edit, ambil data order
    if (editOrderId) {
      const orderRes = await fetch(`${API_URL}/api/orders/${editOrderId}`, {
        headers: {
          Authorization: `Bearer ${session.user?.backendToken || ""}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (orderRes.ok) {
        const orderData = await orderRes.json();
        // ✅ Pastikan hanya order DRAFT yang bisa diedit
        if (orderData.data?.status === "DRAFT" && Array.isArray(orderData.data.items)) {
          initialOrder = orderData.data;
        }
      }
    }
  } catch (err) {
    console.error("Fetch data error:", err);
  }

  return (
    <CashierClient
      user={{
        id: session.user?.id || "",
        username: session.user?.username || "",
        role: session.user?.role || "cashier",
        backendToken: session.user?.backendToken || null,
        backendRefreshToken: session.user?.backendRefreshToken || null,
      }}
      initialProducts={products}
      initialOrder={initialOrder} // ✅ Kirim data order ke client
    />
  );
}
