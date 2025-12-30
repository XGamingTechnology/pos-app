"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import { rupiah } from "@/lib/formatters";
import { Toaster, toast } from "sonner"; // ✅ Tambahkan ini

type OrderItem = {
  product_name: string;
  qty: number;
  price: number;
  subtotal: number;
};

type Order = {
  id: string;
  customer_name: string;
  table_number: string;
  status: "DRAFT" | "PAID" | "CANCELED";
  total: number; // ini adalah subtotal awal (tanpa diskon & pajak)
  created_at: string;
  items: OrderItem[];
};

export default function PaymentClient({ order }: { order: Order }) {
  const router = useRouter();
  const { data } = useSession();
  const [method, setMethod] = useState<string>("");
  const [includeTax, setIncludeTax] = useState<boolean>(false);
  const [discount, setDiscount] = useState<string>("0");
  const [loading, setLoading] = useState(false);

  const discountValue = useMemo(() => {
    const val = parseFloat(discount);
    return isNaN(val) || val < 0 ? 0 : val;
  }, [discount]);

  const finalSubtotal = Math.max(0, order.total - discountValue);
  const taxAmount = includeTax ? Math.round(finalSubtotal * 0.1) : 0;
  const finalTotal = finalSubtotal + taxAmount;

  const confirmPayment = async () => {
    if (!method || !data?.user) {
      toast.error("⚠️ Pilih metode pembayaran terlebih dahulu");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order.id}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.user.backendToken}`,
        },
        body: JSON.stringify({
          paymentMethod: method,
          includeTax: includeTax,
          discount: discountValue,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gagal memproses pembayaran");

      // ✅ Notifikasi sukses yang profesional
      toast.success("✅ Pembayaran Berhasil!", {
        description: "Struk sedang dibuka di jendela baru.",
        duration: 5000,
        icon: "✅",
      });

      // Buka struk di tab baru
      window.open(`/print/receipt/${order.id}`, "_blank", "width=400,height=600");

      // Refresh & redirect
      router.refresh();
      router.push("/orders");
    } catch (err: any) {
      console.error("PAYMENT ERROR:", err);
      toast.error("❌ Gagal Memproses Pembayaran", {
        description: err.message || "Coba lagi beberapa saat.",
        duration: 6000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Tambahkan Toaster di sini */}
      <Toaster position="top-right" richColors />

      <div className="bg-gray-50 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">💳 Pembayaran</h1>
              <p className="text-xs text-gray-600 mt-0.5">Atur diskon & pajak sebelum bayar</p>
            </div>
            <button onClick={() => router.push("/orders")} className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              ← Kembali
            </button>
          </div>
        </header>

        <main className="max-w-xl mx-auto p-4 space-y-5">
          {/* ORDER INFO */}
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg mb-3">Informasi Order</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-900">
                <span className="text-gray-600">ID Order</span>
                <span className="font-medium">{order.id}</span>
              </div>
              <div className="flex justify-between text-gray-900">
                <span className="text-gray-600">Pelanggan</span>
                <span className="font-medium">{order.customer_name || "Customer Umum"}</span>
              </div>
              <div className="flex justify-between text-gray-900">
                <span className="text-gray-600">Meja</span>
                <span className="font-medium">{order.table_number || "–"}</span>
              </div>
              <div className="flex justify-between text-gray-900">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-blue-600">{rupiah(order.total)}</span>
              </div>
            </div>
          </section>

          {/* ITEMS */}
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg mb-3">Item Pesanan</h2>
            <div className="space-y-2.5">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="text-gray-900">
                    <span className="font-semibold">{item.qty}×</span>
                    <span className="ml-2">{item.product_name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{rupiah(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* DISKON INPUT */}
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Diskon (Rp)</h3>
              <input
                type="number"
                min="0"
                max={order.total}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Maksimal: {rupiah(order.total)}</p>
            </div>
          </section>

          {/* TOGGLE PAJAK */}
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Tambah Pajak 10%</h3>
                <p className="text-xs text-gray-500 mt-1">Dihitung dari: {rupiah(finalSubtotal)}</p>
              </div>
              <button onClick={() => setIncludeTax(!includeTax)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${includeTax ? "bg-green-500" : "bg-gray-300"}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${includeTax ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </section>

          {/* RINCIAN PEMBAYARAN */}
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-medium text-gray-900 mb-3">Rincian Pembayaran</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{rupiah(order.total)}</span>
              </div>
              {discountValue > 0 && (
                <div className="flex justify-between text-red-600 font-medium">
                  <span>Diskon</span>
                  <span>- {rupiah(discountValue)}</span>
                </div>
              )}
              {includeTax && (
                <div className="flex justify-between text-amber-600">
                  <span>Pajak (10%)</span>
                  <span>+ {rupiah(taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-lg">
                <span>Total Bayar</span>
                <span className="text-green-600">{rupiah(finalTotal)}</span>
              </div>
            </div>
          </section>

          {/* PAYMENT METHOD */}
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Metode Pembayaran</h2>
            <div className="grid grid-cols-2 gap-3">
              {["CASH", "QRIS", "DEBIT", "TRANSFER"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`py-3.5 rounded-xl font-semibold transition-all ${method === m ? "bg-green-600 text-white border-2 border-green-600" : "bg-gray-50 text-gray-800 border-2 border-gray-200 hover:bg-gray-100"}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </section>

          {/* CONFIRM BUTTON */}
          <button
            onClick={confirmPayment}
            disabled={!method || loading}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${!method || loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 active:scale-[0.99]"}`}
          >
            {loading ? "Memproses..." : "✅ Konfirmasi Pembayaran"}
          </button>
        </main>
      </div>
    </>
  );
}
