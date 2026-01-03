// app/report/ReportClient.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type UserRole = "admin" | "cashier";

type Order = {
  id: string;
  created_at: string;
  customer_name?: string;
  table_number?: string;
  total: number;
  status: "DRAFT" | "PAID" | "CANCELED";
  payment_method?: string;
};

type TopProduct = {
  name: string;
  qty: number;
  revenue: number;
};

type CurrentUser = {
  id: string;
  username: string;
  role: "admin" | "cashier" | "owner";
  backendToken: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Warna profesional
const PAYMENT_COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"];
const PRODUCT_COLORS = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#3B82F6", "#8B5CF6", "#EC4899", "#6B7280", "#10B981", "#F59E0B"];

export default function ReportClient({ orders, currentUser, canExport }: { orders: Order[]; currentUser: CurrentUser; canExport: boolean }) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [dateFilter, setDateFilter] = useState<"today" | "7days" | "30days" | "all" | "custom">("7days");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [topProductsMode, setTopProductsMode] = useState<"qty" | "revenue">("qty");
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showCustomDate, setShowCustomDate] = useState(false);
  const itemsPerPage = 10;

  // Fetch produk terlaris berdasarkan filter
  useEffect(() => {
    const fetchTopProducts = async () => {
      if (!currentUser.backendToken) return;

      try {
        let url = `${API_URL}/api/admin/reports/top-products?`;
        if (dateFilter === "custom" && startDate && endDate) {
          url += `start=${startDate}&end=${endDate}`;
        } else {
          url += `period=${dateFilter}`;
        }
        
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${currentUser.backendToken}` },
        });
        const data = await res.json();
        setTopProducts(data.success ? data.data : []);
      } catch (err) {
        console.error("Fetch top products error:", err);
        setTopProducts([]);
      }
    };
    fetchTopProducts();
  }, [dateFilter, startDate, endDate, currentUser.backendToken]);

  // Filter order PAID
  const paidOrders = orders.filter((o) => o.status === "PAID");

  // Helper: cek apakah order dalam rentang
  const isWithinDays = (dateStr: string, days: number) => {
    const orderDate = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - orderDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  };

  const isToday = (dateStr: string) => {
    const today = new Date();
    const orderDate = new Date(dateStr);
    return orderDate.getDate() === today.getDate() && orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
  };

  const isBetweenDates = (dateStr: string, start: string, end: string) => {
    const orderDate = new Date(dateStr);
    const startDate = new Date(start);
    const endDate = new Date(end);
    return orderDate >= startDate && orderDate <= endDate;
  };

  // Terapkan filter pada order
  const filteredOrders = paidOrders.filter((order) => {
    let dateMatch = true;
    if (dateFilter === "today") {
      dateMatch = isToday(order.created_at);
    } else if (dateFilter === "7days") {
      dateMatch = isWithinDays(order.created_at, 7);
    } else if (dateFilter === "30days") {
      dateMatch = isWithinDays(order.created_at, 30);
    } else if (dateFilter === "custom" && startDate && endDate) {
      dateMatch = isBetweenDates(order.created_at, startDate, endDate);
    }

    const methodMatch = methodFilter === "all" || order.payment_method === methodFilter;
    const searchMatch = !searchTerm || order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toLowerCase().includes(searchTerm.toLowerCase());

    return dateMatch && methodMatch && searchMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Hitung statistik
  const totalOmzet = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalTransaksi = filteredOrders.length;
  const rataRataPerTransaksi = totalTransaksi > 0 ? totalOmzet / totalTransaksi : 0;

  // Siapkan data grafik
  const getDailyData = () => {
    const daily: Record<string, { date: string; total: number; count: number }> = {};
    
    // For custom date range, calculate based on the selected range
    if (dateFilter === "custom" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Create date range
      const dateRange = [];
      const currentDate = new Date(start);
      while (currentDate <= end) {
        const key = currentDate.toISOString().split("T")[0];
        dateRange.push(key);
        daily[key] = { date: key, total: 0, count: 0 };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else {
      // For other periods, use the existing logic
      const now = new Date();
      const days = dateFilter === "7days" ? 7 : dateFilter === "30days" ? 30 : 7; // Default to 7 days
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const key = date.toISOString().split("T")[0];
        daily[key] = { date: key, total: 0, count: 0 };
      }
    }

    filteredOrders.forEach((order) => {
      const key = order.created_at.split("T")[0];
      if (daily[key]) {
        daily[key].total += order.total;
        daily[key].count += 1;
      }
    });

    return Object.values(daily).map((d) => ({
      ...d,
      label: new Date(d.date).toLocaleDateString("id-ID", { 
        weekday: "short", 
        day: "numeric", 
        month: "short"
      }),
    }));
  };

  const getPaymentMethodData = () => {
    const map = new Map<string, number>();
    filteredOrders.forEach((order) => {
      const method = order.payment_method || "Lainnya";
      map.set(method, (map.get(method) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  };

  const dailyData = getDailyData();
  const paymentData = getPaymentMethodData();
  const paymentMethods = Array.from(new Set(paidOrders.map((o) => o.payment_method).filter(Boolean)));

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📊 Laporan Penjualan</h1>
            <p className="text-gray-600 mt-1 text-sm">Analisis performa penjualan Anda</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/cashier" className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
              ⬅ Kembali ke Kasir
            </Link>
            {canExport && (
              <button onClick={handlePrint} disabled={isPrinting} className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                {isPrinting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mencetak...
                  </>
                ) : (
                  <>🖨 Cetak Laporan</>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Periode</label>
            <select
              value={dateFilter}
              onChange={(e) => {
                const value = e.target.value as "today" | "7days" | "30days" | "all" | "custom";
                setDateFilter(value);
                if (value !== "custom") {
                  setShowCustomDate(false);
                } else {
                  setShowCustomDate(true);
                }
              }}
              className="w-full px-3.5 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="today">Hari Ini</option>
              <option value="7days">7 Hari Terakhir</option>
              <option value="30days">30 Hari Terakhir</option>
              <option value="all">Semua Waktu</option>
              <option value="custom">Rentang Tanggal</option>
            </select>
          </div>

          {showCustomDate && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Tanggal Mulai</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Tanggal Akhir</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Metode Pembayaran</label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">Semua Metode</option>
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Cari Pelanggan / ID Order</label>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nama pelanggan atau ID order"
              className="w-full px-3.5 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* NOTIFICATION */}
      {filteredOrders.length === 0 && paidOrders.length > 0 && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm flex items-center gap-1.5">
              <span>💡</span> Tidak ada data yang sesuai filter. Coba ubah periode atau metode pembayaran.
            </p>
          </div>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <main className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          <SummaryCard label="Total Transaksi" value={totalTransaksi.toString()} icon="🧾" />
          <SummaryCard label="Total Omzet" value={formatCurrency(totalOmzet)} icon="💰" />
          <SummaryCard label="Rata-rata/Transaksi" value={totalTransaksi === 0 ? "Rp 0" : formatCurrency(rataRataPerTransaksi)} icon="⚖️" />
          <SummaryCard
            label="Rata-rata/Hari"
            value={
              dateFilter === "today" 
                ? formatCurrency(totalOmzet) 
                : dateFilter === "7days" 
                  ? formatCurrency(totalOmzet / 7) 
                  : dateFilter === "30days" 
                    ? formatCurrency(totalOmzet / 30) 
                    : dateFilter === "custom" && startDate && endDate
                      ? (() => {
                          const start = new Date(startDate);
                          const end = new Date(endDate);
                          const diffTime = Math.abs(end.getTime() - start.getTime());
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
                          return formatCurrency(totalOmzet / diffDays);
                        })()
                      : dateFilter === "all"
                        ? "–"
                        : formatCurrency(totalOmzet / 7)
            }
            icon="📅"
          />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Omzet Harian - Judul dinamis sesuai filter */}
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">
              {dateFilter === "today" 
                ? "📈 Omzet Harian (Hari Ini)" 
                : dateFilter === "7days" 
                  ? "📈 Omzet Harian (7 Hari Terakhir)" 
                  : dateFilter === "30days" 
                    ? "📈 Omzet Harian (30 Hari Terakhir)" 
                    : dateFilter === "custom" && startDate && endDate
                      ? `📈 Omzet Harian (${startDate} - ${endDate})`
                      : "📈 Omzet Harian (Semua Waktu)"}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="label" tick={{ fill: "#4b5563" }} />
                  <YAxis tickFormatter={(value) => `Rp${value / 1000}k`} tick={{ fill: "#4b5563" }} />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), "Omzet"]} 
                    labelFormatter={(label) => `Tanggal: ${label}`} 
                    contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e5e7eb" }} 
                  />
                  <Bar dataKey="total" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Metode Pembayaran */}
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">💳 Metode Pembayaran</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => {
                      if (percent === undefined) return name;
                      return `${name}: ${(percent * 100).toFixed(0)}%`;
                    }}
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Transaksi"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* PRODUK TERLARIS - Desain ulang untuk tampilan yang lebih user-friendly */}
        {topProducts.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-semibold text-gray-900 text-lg">🔥 10 Produk Terlaris</h3>
              <div className="flex items-center gap-2">
                <select 
                  value={topProductsMode} 
                  onChange={(e) => setTopProductsMode(e.target.value as "qty" | "revenue")} 
                  className="text-sm border border-gray-300 rounded px-2.5 py-1.5 text-gray-900"
                >
                  <option value="qty">Berdasarkan Jumlah Terjual</option>
                  <option value="revenue">Berdasarkan Pendapatan</option>
                </select>
              </div>
            </div>
            
            {/* Tabel Produk Terlaris - lebih user-friendly */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">No</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Produk</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {topProductsMode === "qty" ? "Jumlah Terjual" : "Pendapatan"}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Grafik</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => {
                    const maxValue = Math.max(...topProducts.map(p => 
                      topProductsMode === "qty" ? p.qty : p.revenue
                    ));
                    const barWidth = (topProductsMode === "qty" 
                      ? (product.qty / maxValue) * 100 
                      : (product.revenue / maxValue) * 100
                    );
                    
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                        <td className="px-4 py-3 text-gray-700">
                          {topProductsMode === "qty" 
                            ? `${product.qty} pcs` 
                            : formatCurrency(product.revenue)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full" 
                              style={{ 
                                width: `${barWidth}%`, 
                                backgroundColor: PRODUCT_COLORS[index % PRODUCT_COLORS.length] 
                              }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* RIWAYAT TRANSAKSI DENGAN PAGINATION */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-semibold text-gray-900 text-lg">Riwayat Transaksi</h3>
            <p className="text-sm text-gray-600">
              Menampilkan <strong>{currentOrders.length}</strong> dari <strong>{filteredOrders.length}</strong> transaksi
            </p>
          </div>

          {currentOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg font-medium">📭 Tidak ada transaksi yang sesuai filter</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <Th>No</Th>
                      <Th>ID Order</Th>
                      <Th>Tanggal</Th>
                      <Th>Pelanggan</Th>
                      <Th>Produk Terjual</Th>
                      <Th>Metode Pembayaran</Th>
                      <Th>Total</Th>
                      <Th>Status</Th>
                      <Th>Aksi</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map((o) => (
                      <OrderRow 
                        key={o.id} 
                        order={o} 
                        formatCurrency={formatCurrency} 
                        formatDate={formatDate}
                        currentUser={currentUser}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="px-5 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-sm text-gray-600">
                    Halaman {currentPage} dari {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Sebelumnya
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Berikutnya
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          main {
            padding: 0 !important;
            max-width: 100% !important;
          }
          .bg-gray-50,
          .bg-white {
            background: white !important;
          }
          .text-gray-900,
          .text-gray-800,
          .text-gray-700,
          .text-gray-600,
          .text-gray-500 {
            color: black !important;
          }
          .recharts-surface {
            display: none !important;
          }
          table {
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}

// Interface untuk detail order
type OrderDetail = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
};

// Komponen untuk baris order
function OrderRow({ 
  order, 
  formatCurrency,
  formatDate,
  currentUser
}: { 
  order: Order; 
  formatCurrency: (value: number) => string;
  formatDate: (dateString: string) => string;
  currentUser: CurrentUser;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = async () => {
    if (!currentUser.backendToken) return;

    try {
      setLoadingDetails(true);
      setError(null);
      
      const res = await fetch(`${API_URL}/api/admin/orders/${order.id}/details`, {
        headers: { 
          Authorization: `Bearer ${currentUser.backendToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        throw new Error('Gagal mengambil detail order');
      }
      
      const data = await res.json();
      setOrderDetails(data.success ? data.data : []);
    } catch (err) {
      console.error("Fetch order details error:", err);
      setError("Gagal memuat detail order");
      setOrderDetails([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  const toggleDetails = () => {
    if (!showDetails) {
      fetchOrderDetails();
    }
    setShowDetails(!showDetails);
  };

  // Ambil nama produk dari detail order
  const getProductNames = () => {
    if (orderDetails.length > 0) {
      return orderDetails.map(detail => detail.product_name).join(', ');
    }
    return 'Detail tidak tersedia';
  };

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50">
        <Td className="font-mono text-xs text-gray-700">{order.id.slice(0, 8).toUpperCase()}</Td>
        <Td className="text-gray-800">{order.customer_name || "Customer Umum"}</Td>
        <Td className="text-gray-700">
          {getProductNames().length > 30 
            ? `${getProductNames().substring(0, 30)}...` 
            : getProductNames()}
        </Td>
        <Td>
          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
            {order.payment_method || "–"}
          </span>
        </Td>
        <Td className="font-semibold text-emerald-700">{formatCurrency(order.total)}</Td>
        <Td>
          <button 
            onClick={toggleDetails}
            className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            {showDetails ? "Sembunyikan" : "Lihat Detail"}
          </button>
        </Td>
      </tr>
      
      {showDetails && (
        <tr className="bg-gray-50">
          <td colSpan={6} className="px-4 py-4">
            {loadingDetails ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-red-600 text-center py-2">{error}</div>
            ) : orderDetails.length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Detail Produk:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 rounded">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Produk</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Jumlah</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Harga</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails.map((detail) => (
                        <tr key={detail.id} className="border-b border-gray-100">
                          <td className="px-3 py-2 text-gray-800">{detail.product_name}</td>
                          <td className="px-3 py-2 text-gray-700">{detail.quantity}</td>
                          <td className="px-3 py-2 text-gray-700">{formatCurrency(detail.price)}</td>
                          <td className="px-3 py-2 font-medium text-emerald-700">{formatCurrency(detail.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total: <span className="font-semibold text-emerald-700">{formatCurrency(order.total)}</span></p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-2 text-gray-500">Tidak ada detail produk tersedia</div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-xl text-gray-700">{icon}</span>
        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 bg-gray-50">{children}</th>;
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 border-b border-gray-100 ${className}`}>{children}</td>;
}
