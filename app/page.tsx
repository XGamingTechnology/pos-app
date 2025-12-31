import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import Link from "next/link";

// Ikon SVG yang konsisten
const CashierIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ReportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const AdminIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.938.562 2.045-.309 2.045-1.362zm-4.961 6.307l3.536 3.536 3.536-3.536a.5.5 0 01.707.707l-4 4a.5.5 0 01-.708 0l-4-4a.5.5 0 01.708-.707z"
    />
  </svg>
);

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login");
  }

  const { user } = session;
  const { username, role } = user;

  const roleLabels = {
    admin: { title: "Administrator", description: "Akses penuh ke semua fitur" },
    cashier: { title: "Kasir", description: "Akses transaksi & laporan penjualan" },
  };

  const { title, description } = roleLabels[role as keyof typeof roleLabels] || {
    title: "User",
    description: "Selamat datang di POS System",
  };

  // Tentukan jumlah kolom berdasarkan role
  const gridCols = role === "admin" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <main className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Halo, <span className="text-emerald-600">{username}</span>!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {title} • {description}
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Online</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`grid ${gridCols} gap-5`}>
          {/* Kasir */}
          <Link href="/cashier" className="block group p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-500">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition">
                <CashierIcon />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Kasir</h2>
                <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">Mulai transaksi penjualan</p>
              </div>
            </div>
          </Link>

          {/* Laporan */}
          <Link href="/report" className="block group p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition">
                <ReportIcon />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Laporan</h2>
                <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">{role === "admin" ? "Laporan lengkap & ekspor data" : "Laporan penjualan (read-only)"}</p>
              </div>
            </div>
          </Link>

          {/* Admin Panel (Hanya untuk admin) */}
          {role === "admin" && (
            <Link href="/admin" className="block group p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition">
                  <AdminIcon />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Admin Panel</h2>
                  <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">Kelola user, kategori, dan produk</p>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-gray-500 dark:text-gray-500 text-sm">POS System • {new Date().getFullYear()}</div>
      </main>
    </div>
  );
}
