"use client";

import { useEffect, useState } from "react";
import { rupiah } from "@/lib/formatters";

export default function ReceiptPrint({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi mobile
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setIsMobile(isMobileDevice);
  }, []);

  // Load order
  useEffect(() => {
    if (!orderId || orderId === "undefined" || orderId === "null") {
      setError("ID order tidak valid");
      return;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(orderId)) {
      setError("Format ID order tidak valid");
      return;
    }

    async function load() {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/public`;
        const res = await fetch(url);

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Gagal memuat data struk");
        }

        const data = await res.json();
        if (!data.success || !data.data) {
          throw new Error("Data struk tidak ditemukan");
        }

        setOrder(data.data);
      } catch (err: any) {
        console.error("Print gagal:", err);
        setError(err.message || "Terjadi kesalahan saat memuat struk");
      }
    }

    load();
  }, [orderId]);

  // 🖨️ Auto-print & auto-close hanya di desktop
  useEffect(() => {
    if (!order || isMobile) return;

    const closeWindow = () => {
      // Hanya close jika window dibuka oleh script (aman)
      if (window.opener || window.name === "receipt") {
        window.close();
      }
    };

    // Gunakan afterprint event
    const handleAfterPrint = () => {
      closeWindow();
    };

    window.addEventListener("afterprint", handleAfterPrint);
    window.print(); // Trigger print

    // Fallback: tutup setelah 8 detik jika afterprint tidak dipanggil
    const fallbackTimeout = setTimeout(closeWindow, 8000);

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
      clearTimeout(fallbackTimeout);
    };
  }, [order, isMobile]);

  // 🔄 Redirect ke kasir setelah kembali dari app (mobile only)
  useEffect(() => {
    if (!isMobile || !order) return;

    // Deteksi kembali dari background (misal: setelah buka app printer)
    const handlePageShow = (event: PageTransitionEvent) => {
      // Jika berasal dari disk cache (kembali dari app eksternal), redirect
      if (event.persisted) {
        const cashierUrl = `${window.location.origin}/kasir`;
        window.location.href = cashierUrl;
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [isMobile, order]);

  // Error UI
  if (error) {
    return (
      <div className="receipt" style={{ padding: "20px", textAlign: "center", fontFamily: "monospace" }}>
        <p style={{ color: "red" }}>❌ {error}</p>
        {!isMobile && (
          <button onClick={() => window.close()} style={{ marginTop: "10px", padding: "6px 12px" }}>
            Tutup
          </button>
        )}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="receipt" style={{ padding: "20px", textAlign: "center", fontFamily: "monospace" }}>
        <p>Memuat struk...</p>
      </div>
    );
  }

  // Formatter
  const formatItemLine = (qty: number, name: string, subtotal: number) => {
    const qtyStr = `${qty}x`.padEnd(4);
    const nameTruncated = name.length > 16 ? name.substring(0, 16) : name.padEnd(16);
    const priceStr = `Rp ${subtotal.toLocaleString("id-ID")}`.padStart(10);
    return `${qtyStr}${nameTruncated} ${priceStr}`;
  };

  const formatPrice = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`.padStart(10);
  };

  const centerText = (text: string, width = 30) => {
    const pad = Math.floor((width - text.length) / 2);
    return " ".repeat(pad > 0 ? pad : 0) + text;
  };

  return (
    <div className="receipt" style={{ fontFamily: "monospace", maxWidth: "300px", margin: "0 auto", padding: "10px" }}>
      <pre className="title">{centerText("SOTO IBUK SENOPATI", 30)}</pre>
      <pre className="center-line">{centerText("Jl.Tulodong Atas 1 no 3A", 30)}</pre>
      <pre className="center-line">{centerText("Kebayoran Baru, Jakarta Selatan", 30)}</pre>
      <hr style={{ margin: "8px 0" }} />

      <div className="meta" style={{ fontSize: "12px", marginBottom: "8px" }}>
        <div>Order: {order.order_number}</div>
        {order.customer_name && <div>Pelanggan: {order.customer_name}</div>}
        {order.table_number && <div>Meja: {order.table_number}</div>}
        <div>Tipe: {order.type_order === "dine_in" ? "Dine In" : "Takeaway"}</div>
        <div>{new Date(order.created_at).toLocaleString("id-ID")}</div>
      </div>

      <hr style={{ margin: "8px 0" }} />

      <div className="items">
        {order.items.map((item: any, idx: number) => (
          <pre key={idx} className="item-line" style={{ margin: "4px 0" }}>
            {formatItemLine(item.qty, item.product_name, item.subtotal)}
          </pre>
        ))}
      </div>

      <hr style={{ margin: "8px 0" }} />

      <pre className="item-line" style={{ margin: "4px 0" }}>
        {"Sub".padEnd(18)} {formatPrice(order.subtotal)}
      </pre>

      {order.discount > 0 && (
        <pre className="item-line" style={{ margin: "4px 0" }}>
          {"Disc".padEnd(18)} {formatPrice(order.discount)}
        </pre>
      )}

      {order.tax > 0 && (
        <pre className="item-line" style={{ margin: "4px 0" }}>
          {"Tax".padEnd(18)} {formatPrice(order.tax)}
        </pre>
      )}

      <pre className="item-line total" style={{ margin: "6px 0", fontWeight: "bold" }}>
        {"TOTAL".padEnd(18)} {formatPrice(order.total)}
      </pre>

      <hr style={{ margin: "8px 0" }} />

      <p className="center" style={{ fontSize: "12px", margin: "6px 0" }}>
        Metode: <strong>{order.payment_method}</strong>
      </p>

      <p className="center thank-you" style={{ margin: "10px 0", fontWeight: "bold" }}>
        Terima kasih 🙏
      </p>

      {/* Mobile action buttons */}
      {isMobile && (
        <div className="print-actions" style={{ marginTop: "16px", textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
          <a
            href={`my.bluetoothprint.scheme://${process.env.NEXT_PUBLIC_API_URL}/api/print/receipt/${orderId}`}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: "#2196F3",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
            }}
          >
            📱 Cetak ke Printer
          </a>

          <button
            onClick={() => window.print()}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            🖨️ Simpan PDF
          </button>

          <button
            onClick={() => (window.location.href = "https://sotoibuksenopati.online/cashier")}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: "#9E9E9E",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            ← Kembali ke Kasir
          </button>
        </div>
      )}
    </div>
  );
}
