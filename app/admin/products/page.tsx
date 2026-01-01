// app/admin/products/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import ProductManagementClient from "./ProductManagementClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);

  const hasValidUser = session?.user && (session.user as any)?.id && (session.user as any)?.username && (session.user as any)?.backendToken;
  const userRole = (session.user as any)?.role;

  if (!session || !hasValidUser || !userRole || userRole !== "admin") {
    return redirect("/login");
  }

  let products = [];
  let categories = [];

  try {
    // Ambil semua produk
    const productsRes = await fetch(`${API_URL}/api/admin/products`, {
      headers: { Authorization: `Bearer ${(session.user as any)?.backendToken || ""}` },
      cache: "no-store",
    });

    if (productsRes.ok) {
      const data = await productsRes.json();
      products = Array.isArray(data.data) ? data.data : [];
    }

    // Ambil daftar kategori unik
    const categoriesRes = await fetch(`${API_URL}/api/admin/products/categories`, {
      headers: { Authorization: `Bearer ${(session.user as any)?.backendToken || ""}` },
      cache: "no-store",
    });

    if (categoriesRes.ok) {
      const data = await categoriesRes.json();
      categories = Array.isArray(data.data) ? data.data : [];
    }
  } catch (err) {
    console.error("Fetch data error:", err);
    products = [];
    categories = [];
  }

  return <ProductManagementClient currentUser={{
    id: (session.user as any)?.id || "",
    username: (session.user as any)?.username || "",
    role: (session.user as any)?.role || "cashier",
    backendToken: (session.user as any)?.backendToken || null
  }} initialProducts={products} initialCategories={categories} />;
}
