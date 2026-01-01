"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type ColorKey = "blue" | "emerald" | "amber" | "purple";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [summary, setSummary] = useState({
    users: 0,
    categories: [] as any[],
    products: 0,
    totalRevenue: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const backendToken = (session?.user as any)?.backendToken;
      if (!backendToken) {
        setIsLoading(false);
        return;
      }

      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/users`, {
            headers: { Authorization: `Bearer ${backendToken}` },
          }),
          fetch(`${API_URL}/api/admin/products`, {
            headers: { Authorization: `Bearer ${backendToken}` },
          }),
          fetch(`${API_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${backendToken}` },
          }),
        ]);

        const summaryData = { ...summary };

        // Users
        if (usersRes.ok) {
          const data = await usersRes.json();
          summaryData.users = data.data?.length || 0;
        }

        // Products & Categories (from products)
        if (productsRes.ok) {
          const data = await productsRes.json();
          const activeProducts = (data.data || []).filter((p: any) => p.active === true);
          summaryData.products = activeProducts.length;

          // Ekstrak kategori unik dari produk aktif
          const uniqueCategories = [...new Set(activeProducts.map((p: any) => p.category).filter((cat: any) => cat != null && cat.toString().trim() !== ""))];
          summaryData.categories = uniqueCategories; // array of strings: ["Minuman", "Makanan", ...]
        }

        // Orders & Revenue
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          const paidOrders = (data.data || []).filter((o: any) => o.status === "PAID");
          summaryData.totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
        }

        setSummary(summaryData);
      } catch (err) {
        console.error("Fetch summary error:", err);
        setError("Gagal memuat data dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [session]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-slate-600 flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-slate-300 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // Type guard function to check if user is admin
  function isAdminUser(user: any): user is { role: 'admin' } {
    return user && user.role === 'admin';
  }

  if (!session?.user || !isAdminUser(session.user as any)) {
    return null;
  }

  // Statistik utama
  const stats: { title: string; value: number; color: ColorKey }[] = [
    { title: "Total User", value: summary.users, color: "blue" },
    { title: "Kategori Produk", value: summary.categories.length, color: "emerald" },
    { title: "Total Produk", value: summary.products, color: "amber" },
    { title: "Omzet Total", value: summary.totalRevenue, color: "purple" },
  ];

  const colors: Record<ColorKey, { bg: string; text: string; border: string }> = {
    blue: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-500" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-500" },
    amber: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-500" },
    purple: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-500" },
  };

  // Helper: konversi angka ke format rupiah
  const rupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  // Helper: dapatkan warna dari kategori
  const getCategoryColor = (color: string | undefined): string => {
    if (color && /^#[0-9A-F]{6}$/i.test(color)) {
      return color;
    }
    return "#6B7280"; // gray-500
  };

  // Notifikasi sistem
  const notifications = [
    {
      type: "info",
      title: "Kategori Produk",
      message: `Saat ini ada ${summary.categories.length} kategori aktif`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      action: "/admin/products",
    },
    {
      type: "warning",
      title: "Produk Aktif",
      message: `Total ${summary.products} produk tersedia untuk dijual`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 17h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      action: "/admin/products",
    },
    {
      type: "success",
      title: "Performa Penjualan",
      message: `Total pendapatan: ${rupiah(summary.totalRevenue)}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 6l-6-6m6 6l-6 6" />
        </svg>
      ),
      action: "/report",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">📊 Dashboard Admin</h1>
        <p className="text-slate-600 mt-1">Ringkasan performa sistem POS Anda</p>
      </div>

      {/* Notifikasi Sistem */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {notifications.map((notif, idx) => {
          const bgColor = notif.type === "info" ? "bg-blue-50" : notif.type === "warning" ? "bg-amber-50" : "bg-green-50";
          const textColor = notif.type === "info" ? "text-blue-700" : notif.type === "warning" ? "text-amber-700" : "text-green-700";
          const borderColor = notif.type === "info" ? "border-blue-500" : notif.type === "warning" ? "border-amber-500" : "border-green-500";

          return (
            <div key={idx} className={`bg-white rounded-lg border ${borderColor} p-4 shadow-sm`}>
              <div className="flex items-start gap-3">
                <div className={`p-1 rounded-full ${bgColor} ${textColor}`}>{notif.icon}</div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">{notif.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                  <Link href={notif.action} className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-800">
                    Lihat Detail →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Statistik Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const colorClass = colors[stat.color];

          // Format nilai sesuai tipe
          const displayValue = stat.title === "Omzet Total" ? rupiah(stat.value) : stat.value;

          const links = ["/admin/users", "/admin/products", "/admin/products", "/report"];
          return (
            <Link key={index} href={links[index]} className="block group">
              <div className={`bg-white rounded-xl border ${colorClass.border} p-4 shadow-sm hover:shadow-md transition-all`}>
                <div className="text-center">
                  <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center ${colorClass.bg} ${colorClass.border}`}>
                    <span className={`text-lg font-bold ${colorClass.text}`}>{displayValue}</span>
                  </div>
                  <h3 className="text-xs font-medium text-slate-600 mt-2">{stat.title}</h3>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Daftar Kategori dengan Warna Dinamis */}
      {summary.categories.length > 0 && (
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">🏷️ Kategori Produk Aktif</h2>
            <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Kelola Kategori →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {summary.categories.map((category: any, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: getCategoryColor(category.color),
                  color: "white",
                }}
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Manajemen Produk */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-3">📦 Manajemen Produk</h3>
          <p className="text-slate-600 text-sm mb-4">Kelola produk, kategori, dan harga jual</p>
          <div className="flex gap-3">
            <Link href="/admin/products" className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
              Lihat Produk
            </Link>
            <Link href="/admin/products" className="px-4 py-2 bg-white border border-amber-600 text-amber-600 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors">
              Kelola Kategori
            </Link>
          </div>
        </div>

        {/* Manajemen User */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-3">👥 Manajemen User</h3>
          <p className="text-slate-600 text-sm mb-4">Tambah atau nonaktifkan akun kasir/admin</p>
          <Link href="/admin/users" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Kelola User
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-slate-500 text-sm pt-6 border-t border-slate-200">
        <p>POS System Admin Panel • {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
