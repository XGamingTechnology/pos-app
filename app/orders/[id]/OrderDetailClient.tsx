// app/orders/[id]/OrderDetailClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { rupiah } from "@/lib/formatters";

type OrderItem = {
  product_name: string;
  qty: number;
  price: number;
  subtotal: number;
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  table_number: string | null;
  type_order: "dine_in" | "takeaway"; // ✅ Tambahkan type_order
  status: "DRAFT" | "PAID" | "CANCELED";
  subtotal: number;
  tax: number;
  total: number;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
  payment_method: string | null;
  items: OrderItem[];
};

export default function OrderDetailClient({ order }: { order: Order }) {
  const router = useRouter();

  const handlePay = () => {
    if (order.status === "DRAFT") {
      router.push(`/payment/${order.id}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID");
  };

  const getStatusConfig = () => {
    switch (order.status) {
      case "PAID":
        return { color: "bg-green-100 text-green-800 border-green-200", label: "DIBAYAR" };
      case "CANCELED":
        return { color: "bg-red-100 text-red-800 border-red-200", label: "DIBATALKAN" };
      default:
        return { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "DRAFT" };
    }
  };

  const statusConfig = getStatusConfig();

  // ✅ Helper: Tampilkan label tipe order
  const getTypeOrderLabel = () => {
    return order.type_order === "dine_in" ? "Makan di Tempat" : "Bawa Pulang";
  };

  // ✅ Cek apakah pajak diterapkan
  const hasTax = order.tax > 0;
  const taxRate = hasTax ? Math.round((order.tax / (order.subtotal || 1)) * 100) : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Detail Order</h1>
            <button onClick={() => router.push("/orders")} className="text-sm text-gray-600 hover:text-gray-900 transition">
              ← Kembali
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-5">
        {/* Informasi Order */}
        <section className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID Order</p>
              <p className="font-mono text-gray-900 break-all">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</p>
              <span className={`inline-block px-3 py-1 mt-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>{statusConfig.label}</span>
            </div>
          </div>

          {order.order_number && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nomor Order</p>
              <p className="text-gray-900 font-medium">{order.order_number}</p>
            </div>
          )}

          {/* ✅ Tampilkan Tipe Order */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tipe Order</p>
            <p className="text-gray-900 font-medium">{getTypeOrderLabel()}</p>
          </div>
        </section>

        {/* Detail Pelanggan */}
        <section className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Informasi Pelanggan</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Nama Pelanggan</p>
              <p className="font-medium text-gray-900">{order.customer_name || "Customer Umum"}</p>
            </div>

            {/* ✅ Tampilkan nomor meja hanya jika dine_in */}
            {order.type_order === "dine_in" ? (
              <div>
                <p className="text-xs text-gray-500">Nomor Meja</p>
                <p className="font-medium text-gray-900">{order.table_number || "-"}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-500">Layanan</p>
                <p className="font-medium text-gray-900">Bawa Pulang</p>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-500">Dibuat</p>
              <p className="font-medium text-gray-900">{formatDate(order.created_at)}</p>
            </div>

            {order.paid_at && (
              <div>
                <p className="text-xs text-gray-500">Dibayar</p>
                <p className="font-medium text-gray-900">{formatDate(order.paid_at)}</p>
              </div>
            )}

            {order.payment_method && (
              <div>
                <p className="text-xs text-gray-500">Metode Pembayaran</p>
                <p className="font-medium text-gray-900">{order.payment_method}</p>
              </div>
            )}
          </div>
        </section>

        {/* Item Pesanan */}
        <section className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Item Pesanan</h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 mr-2">{item.qty}x</span>
                    <span className="text-gray-900">{item.product_name}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Rp {item.price.toLocaleString("id-ID")}/item</p>
                </div>
                <span className="font-bold text-gray-900 min-w-[80px] text-right">{rupiah(item.subtotal)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Rincian Pembayaran */}
        <section className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Rincian Pembayaran</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-medium text-gray-900">{rupiah(order.subtotal)}</span>
            </div>

            {hasTax ? (
              <div className="flex justify-between">
                <span className="text-gray-700">Pajak ({taxRate}%)</span>
                <span className="font-medium text-gray-900">{rupiah(order.tax)}</span>
              </div>
            ) : (
              <div className="flex justify-between text-gray-500">
                <span>Pajak</span>
                <span>-</span>
              </div>
            )}

            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="font-bold text-gray-900 text-lg">Total</span>
              <span className="font-bold text-green-600 text-lg">{rupiah(order.total)}</span>
            </div>
          </div>
        </section>

        {/* Tombol Aksi */}
        {order.status === "DRAFT" && (
          <div className="flex gap-3">
            <button onClick={() => router.push(`/cashier?edit=${order.id}`)} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-md">
              ✏️ Edit Order
            </button>
            <button onClick={handlePay} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md">
              💳 Bayar
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
