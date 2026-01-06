// app/payment/[id]/PaymentClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import { rupiah } from "@/lib/formatters";
import { Toaster, toast } from "sonner";

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
  total: number; // subtotal awal
  created_at: string;
  items: OrderItem[];
};

export default function PaymentClient({ order }: { order: Order }) {
  const router = useRouter();
  const { data } = useSession();
  const [method, setMethod] = useState<string>("");
  const [includeTax, setIncludeTax] = useState<boolean>(false);
  const [discount, setDiscount] = useState<string>("0");
  const [cashReceived, setCashReceived] = useState<string>(""); // ✅ input uang cash
  const [loading, setLoading] = useState(false);

  const discountValue = useMemo(() => {
    const val = parseFloat(discount);
    return isNaN(val) || val < 0 ? 0 : Math.min(val, order.total);
  }, [discount, order.total]);

  const finalSubtotal = Math.max(0, order.total - discountValue);
  const taxAmount = includeTax ? Math.round(finalSubtotal * 0.1) : 0;
  const finalTotal = finalSubtotal + taxAmount;

  const cashReceivedValue = useMemo(() => {
    const val = parseFloat(cashReceived);
    return isNaN(val) || val < 0 ? 0 : val;
  }, [cashReceived]);

  const changeAmount = cashReceivedValue > finalTotal ? cashReceivedValue - finalTotal : 0;
  const isCashMethod = method === "CASH";

  const isCashValid = isCashMethod ? cashReceivedValue >= finalTotal : true;

  const confirmPayment = async () => {
    if (!method || !data?.user) {
      toast.error("⚠️ Pilih metode pembayaran terlebih dahulu");
      return;
    }

    if (isCashMethod && cashReceivedValue < finalTotal) {
      toast.error("❌ Uang cash tidak cukup!", {
        description: `Minimal: ${rupiah(finalTotal)}`,
      });
      return;
    }

    try {
      setLoading(true);

      // Map UI payment method values to backend values
      const getBackendPaymentMethod = (uiMethod: string): string => {
        const methodMap: Record<string, string> = {
          "CASH": "cash",
          "QRIS": "qris", 
          "DEBIT": "debit",
          "CREDIT": "credit",
          "TRANSFER": "transfer"
        };
        return methodMap[uiMethod] || uiMethod.toLowerCase();
      };

      const payload: Record<string, any> = {
        paymentMethod: getBackendPaymentMethod(method),
        includeTax,
        discount: discountValue,
      };

      // ✅ Kirim cashReceived hanya jika metode = cash
      if (isCashMethod) {
        payload.cashReceived = cashReceivedValue;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order.id}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.user.backendToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gagal memproses pembayaran");

      toast.success("✅ Pembayaran Berhasil!", {
        description: "Struk sedang dibuka di jendela baru.",
        duration: 5000,
      });

      window.open(`/print/receipt/${order.id}`, "_blank", "width=400,height=600");
      router.refresh();
      router.push("/orders");
      router.refresh();
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
      <Toaster position="top-right" richColors />

      <div className="bg-gray-50 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">💳 Pembayaran</h1>
              <p className="text-xs text-gray-600 mt-0.5">Atur diskon, pajak, dan metode bayar</p>
            </div>
            <button onClick={() => {router.push("/orders"); router.refresh();}} className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
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
                <span className="text-gray-600">Pelanggan</span>
                <span className="font-medium">{order.customer_name || "Customer Umum"}</span>
              </div>
              <div className="flex justify-between text-gray-900">
                <span className="text-gray-600">Meja</span>
                <span className="font-medium">{order.table_number || "–"}</span>
              </div>
              <div className="flex justify-between text-gray-900">
                <span className="text-blue-600">Subtotal Awal</span>
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

          {/* DISKON */}
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
                <p className="text-xs text-gray-500 mt-1">Dari: {rupiah(finalSubtotal)}</p>
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
                  <span>-{rupiah(discountValue)}</span>
                </div>
              )}
              {includeTax && (
                <div className="flex justify-between text-amber-600">
                  <span>Pajak (10%)</span>
                  <span>+{rupiah(taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-lg">
                <span>Total Bayar</span>
                <span className="text-green-600">{rupiah(finalTotal)}</span>
              </div>
            </div>
          </section>

          {/* INPUT CASH (Hanya muncul saat CASH dipilih) */}
          {isCashMethod && (
            <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-2">Uang Tunai Diterima</h3>
              <input
                type="number"
                min={finalTotal}
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                placeholder={`Minimal ${rupiah(finalTotal)}`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              {cashReceivedValue > finalTotal && <p className="text-sm text-green-600 mt-2 font-medium">Kembalian: {rupiah(changeAmount)}</p>}
              {!isCashValid && cashReceivedValue > 0 && <p className="text-sm text-red-600 mt-2">Uang kurang! Minimal {rupiah(finalTotal)}</p>}
            </section>
          )}

          {/* METODE PEMBAYARAN */}
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Metode Pembayaran</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { display: "Tunai", value: "CASH" },
                { display: "QRIS", value: "QRIS" },
                { display: "Debit", value: "DEBIT" },
                { display: "Kredit", value: "CREDIT" },
                { display: "Transfer", value: "TRANSFER" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setMethod(option.value);
                    if (option.value !== "CASH") setCashReceived(""); // reset
                  }}
                  className={`py-3.5 rounded-xl font-semibold transition-all ${method === option.value ? "bg-green-600 text-white border-2 border-green-600" : "bg-gray-50 text-gray-800 border-2 border-gray-200 hover:bg-gray-100"}`}
                >
                  {option.display}
                </button>
              ))}
            </div>
          </section>

          {/* TOMBOL BAYAR */}
          <button
            onClick={confirmPayment}
            disabled={!method || !isCashValid || loading}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${!method || !isCashValid || loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 active:scale-[0.99]"}`}
          >
            {loading ? "Memproses..." : "✅ Konfirmasi Pembayaran"}
          </button>
        </main>
      </div>
    </>
  );
}
