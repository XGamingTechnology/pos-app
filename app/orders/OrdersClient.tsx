"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { hasPermission } from "@/lib/auth";
import { Toaster, toast } from "sonner";
import { useTable, usePagination, Column, TableOptions, Row, CellProps } from "react-table";

/* ================= TYPES ================= */
export type Order = {
  id: string;
  order_number?: string;
  customer_name?: string;
  table_number?: string;
  status: "DRAFT" | "PAID" | "CANCELED";
  total: number;
  created_at: string; // ISO string
};

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const DASHBOARD_URL = "https://sotoibuksenopati.online";

/* ================= FORMATTER ================= */
const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

const formatDateShort = (iso: string) => {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
};

const safeParseTotal = (value: any): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

export default function OrdersClient({ initialOrders = [] }: { initialOrders?: Order[] }) {
  const { data, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [tableFilter, setTableFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<"today" | "yesterday" | "7days" | "30days" | "all">("today");
  const [statusFilter, setStatusFilter] = useState<"DRAFT" | "PAID" | "CANCELED" | "all">("DRAFT"); // ✅ default ke DRAFT
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchOrders = async () => {
    if (status !== "authenticated" || !data?.user) return;

    const userRole = data.user.role;
    if (!hasPermission(userRole, "ACCESS_ORDERS")) {
      setOrders([]);
      setTotalOrders(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());
      if (searchTerm) queryParams.append("search", searchTerm);
      if (customerFilter) queryParams.append("customer", customerFilter);
      if (tableFilter) queryParams.append("table", tableFilter);
      if (dateFilter !== "all") queryParams.append("dateRange", dateFilter);
      if (statusFilter !== "all") queryParams.append("status", statusFilter); // ✅ kirim status filter

      const res = await fetch(`${API_URL}/api/orders?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${data.user.backendToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const result = await res.json();
      const normalizedOrders = (result.data || []).map((order: any) => ({
        ...order,
        total: safeParseTotal(order.total),
      }));

      setOrders(normalizedOrders);
      setTotalOrders(result.total || 0);
    } catch (err) {
      console.error("FETCH ORDERS ERROR:", err);
      toast.error("Gagal memuat daftar order");
      setOrders([]);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, data, page, searchTerm, customerFilter, tableFilter, dateFilter, statusFilter]);

  /* ================= TABLE COLUMNS ================= */
  const columns = useMemo<Column<Order>[]>(
    () => [
      {
        Header: "Order & Pelanggan",
        accessor: "order_number",
        Cell: ({ row }: { row: Row<Order> }) => {
          const order = row.original;
          return (
            <div>
              <p className="text-xs text-slate-500 font-medium">{order.order_number || `ORD-${order.id.slice(0, 8).toUpperCase()}`}</p>
              <p className="text-sm font-semibold text-slate-900 truncate">{order.customer_name && order.customer_name !== "-" ? order.customer_name : "Customer Umum"}</p>
            </div>
          );
        },
      },
      {
        Header: "Meja",
        accessor: "table_number",
        Cell: ({ value }: CellProps<Order, string | undefined>) => {
          if (!value || value === "-") {
            return <span className="text-slate-400 italic">-</span>;
          }
          return `Meja ${value}`;
        },
      },
      {
        Header: "Tanggal",
        accessor: "created_at",
        Cell: ({ value }: CellProps<Order, string | undefined>) => {
          if (!value) return <span className="text-slate-400">—</span>;
          return <span className="text-sm text-slate-500">{formatDateShort(value)}</span>;
        },
      },
      {
        Header: "Total",
        accessor: "total",
        Cell: ({ value }: CellProps<Order, number>) => <span className="text-sm font-bold text-slate-900">{rupiah(value)}</span>,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }: { row: Row<Order> }) => {
          const { status } = row.original;
          let badgeClass = "";
          let badgeText = "";

          if (status === "DRAFT") {
            badgeClass = "bg-red-100 text-red-800 border border-red-200"; // 🔴 Lebih mencolok
            badgeText = "Belum Bayar";
          } else if (status === "PAID") {
            badgeClass = "bg-green-100 text-green-800 border border-green-200"; // 🟢 Hijau jelas
            badgeText = "Sudah Bayar";
          } else {
            badgeClass = "bg-gray-100 text-gray-800 border border-gray-200";
            badgeText = "Dibatalkan";
          }

          return (
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${badgeClass}`}>{badgeText}</span>
              {status === "DRAFT" && (
                <Link href={`/orders/${row.original.id}`} className="text-xs bg-emerald-600 text-white px-2.5 py-1.5 rounded-md hover:bg-emerald-700 transition font-medium whitespace-nowrap">
                  Bayar →
                </Link>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  const tableInstance = useTable<Order>({
    columns,
    data: orders,
    manualPagination: true,
    pageCount: Math.ceil(totalOrders / limit),
    initialState: { pageIndex: page - 1, pageSize: limit },
  } as TableOptions<Order>);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  const totalPages = Math.ceil(totalOrders / limit);

  if (status === "loading") return <p className="text-center mt-10">Loading session...</p>;
  if (status === "unauthenticated" || !data?.user) return <p className="text-center mt-10">Unauthorized</p>;

  return (
    <>
      <Toaster position="top-right" richColors />

      <div className="bg-slate-50 min-h-screen text-slate-900">
        {/* NAVBAR */}
        <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <nav className="flex items-center gap-6 text-sm font-medium">
              <a href={DASHBOARD_URL} className="text-slate-700 hover:text-emerald-600 transition">
                Dashboard
              </a>
              <Link href="/orders" className="text-emerald-600 border-b-2 border-emerald-600">
                Daftar Order
              </Link>
              {/* ❌ Hapus link "Kasir" sesuai permintaan */}
            </nav>

            <div>
              <h1 className="font-bold text-xl text-slate-900">📋 Daftar Order</h1>
              <p className="text-sm text-slate-500">Kelola order dari kasir</p>
            </div>

            <Link href="/cashier" className="inline-flex items-center justify-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition font-medium">
              + Order Baru
            </Link>
          </div>

          {/* FILTERS */}
          <div className="max-w-7xl mx-auto px-4 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Cari</label>
                <input
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Order/Nama/Meja"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 block mb-1">Nama</label>
                <input
                  value={customerFilter}
                  onChange={(e) => {
                    setCustomerFilter(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Pelanggan"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 block mb-1">Meja</label>
                <input
                  value={tableFilter}
                  onChange={(e) => {
                    setTableFilter(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Nomor meja"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 block mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="DRAFT">Belum Bayar</option>
                  <option value="PAID">Sudah Bayar</option>
                  <option value="CANCELED">Dibatalkan</option>
                  <option value="all">Semua</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-slate-500 block mb-1">Periode</label>
                <select
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value as "today" | "yesterday" | "7days" | "30days" | "all");
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="today">Hari Ini</option>
                  <option value="yesterday">Kemarin</option>
                  <option value="7days">7 Hari Terakhir</option>
                  <option value="30days">30 Hari Terakhir</option>
                  <option value="all">Semua Waktu</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* ORDER LIST */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-600"></div>
              <p className="mt-2 text-sm text-slate-500">Memuat data...</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table {...getTableProps()} className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps()} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {column.render("Header")}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()} className="bg-white divide-y divide-slate-200">
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                          Tidak ada data order.
                        </td>
                      </tr>
                    ) : (
                      rows.map((row) => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()} className="hover:bg-slate-50 cursor-pointer" onClick={() => (window.location.href = `/orders/${row.original.id}`)}>
                            {row.cells.map((cell) => (
                              <td {...cell.getCellProps()} className="px-4 py-3 text-sm">
                                {cell.render("Cell")}
                              </td>
                            ))}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 px-2">
                  <p className="text-sm text-slate-600">
                    Menampilkan {(page - 1) * limit + 1}–{Math.min(page * limit, totalOrders)} dari {totalOrders} order
                  </p>

                  <div className="flex gap-1">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100">
                      Sebelumnya
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pageNum) => (
                      <button key={pageNum} onClick={() => setPage(pageNum)} className={`px-3 py-1.5 text-sm rounded-md ${page === pageNum ? "bg-emerald-600 text-white" : "border hover:bg-slate-100"}`}>
                        {pageNum}
                      </button>
                    ))}

                    {totalPages > 5 && page > 3 && <span className="px-3 py-1.5 text-sm text-slate-500">...</span>}

                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100">
                      Selanjutnya
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
