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

  // ✅ Auto-print & auto-close setelah print selesai (desktop only)
  // Auto-print & auto-close yang lebih andal
  useEffect(() => {
    if (order) {
      const closeWindow = () => {
        // Coba tutup, tapi hanya jika dibuka oleh script
        if (window.opener || window.name === "receipt") {
          setTimeout(() => {
            window.close();
          }, 500);
        }
      };

      if (!isMobile) {
        // Coba pakai afterprint (desktop)
        const handleAfterPrint = () => {
          closeWindow();
        };

        if (window.matchMedia) {
          // Deteksi jika print dialog muncul (fallback untuk browser lama)
          const mediaQueryList = window.matchMedia("print");
          mediaQueryList.addListener((mql) => {
            if (!mql.matches) {
              // Setelah print selesai
              closeWindow();
            }
          });
        }

        window.addEventListener("afterprint", handleAfterPrint);

        // Trigger print
        window.print();

        // Fallback: tutup otomatis setelah 8 detik jika afterprint tidak jalan
        const fallbackTimeout = setTimeout(closeWindow, 8000);

        return () => {
          window.removeEventListener("afterprint", handleAfterPrint);
          clearTimeout(fallbackTimeout);
        };
      }
    }
  }, [order, isMobile]);

  // Error UI
  if (error) {
    return (
      <div className="receipt" style={{ padding: "20px", textAlign: "center", fontFamily: "monospace" }}>
        <p style={{ color: "red" }}>❌ {error}</p>
        <button onClick={() => window.close()} style={{ marginTop: "10px", padding: "6px 12px" }}>
          Tutup
        </button>
      </div>
    );
  }

  // Loading UI
  if (!order) {
    return (
      <div className="receipt" style={{ padding: "20px", textAlign: "center", fontFamily: "monospace" }}>
        <p>Memuat struk...</p>
      </div>
    );
  }

  // Format item
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
    <div className="receipt">
      <pre className="title">{centerText("SOTO IBUK SENOPATI", 30)}</pre>
      <pre className="center-line">{centerText("Jl.Tulodong Atas 1 no 3A", 30)}</pre>
      <pre className="center-line">{centerText("Kebayoran Baru, Jakarta Selatan", 30)}</pre>
      <hr />

      <div className="meta">
        <div>Order: {order.order_number}</div>
        {order.customer_name && <div>Pelanggan: {order.customer_name}</div>}
        {order.table_number && <div>Meja: {order.table_number}</div>}
        <div>Tipe: {order.type_order === "dine_in" ? "Dine In" : "Takeaway"}</div>
        <div>{new Date(order.created_at).toLocaleString("id-ID")}</div>
      </div>

      <hr />

      <div className="items">
        {order.items.map((item: any, idx: number) => (
          <pre key={idx} className="item-line">
            {formatItemLine(item.qty, item.product_name, item.subtotal)}
          </pre>
        ))}
      </div>

      <hr />

      <pre className="item-line">
        {"Sub".padEnd(18)} {formatPrice(order.subtotal)}
      </pre>

      {order.discount > 0 && (
        <pre className="item-line">
          {"Disc".padEnd(18)} {formatPrice(order.discount)}
        </pre>
      )}

      {order.tax > 0 && (
        <pre className="item-line">
          {"Tax".padEnd(18)} {formatPrice(order.tax)}
        </pre>
      )}

      <pre className="item-line total">
        {"TOTAL".padEnd(18)} {formatPrice(order.total)}
      </pre>

      <hr />

      <p className="center">
        Metode: <strong>{order.payment_method}</strong>
      </p>

      <p className="center thank-you">Terima kasih 🙏</p>

      {/* Tombol hanya di mobile */}
      {isMobile && (
        <div className="print-actions" style={{ marginTop: "10px", textAlign: "center" }}>
          {/* Cetak via Bluetooth Print App */}
          <a
            href={`my.bluetoothprint.scheme://${process.env.NEXT_PUBLIC_API_URL}/api/print/receipt/${orderId}`}
            style={{
              display: "inline-block",
              padding: "6px 12px",
              fontSize: "14px",
              backgroundColor: "#2196F3",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              marginRight: "10px",
            }}
          >
            📱 Cetak ke Printer
          </a>

          {/* Opsional: simpan PDF via browser */}
          <button
            onClick={() => window.print()}
            style={{
              padding: "6px 12px",
              fontSize: "14px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            🖨️ Simpan PDF
          </button>

          <button
            onClick={() => window.close()}
            style={{
              padding: "6px 12px",
              fontSize: "14px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ✖ Tutup
          </button>
        </div>
      )}
    </div>
  );
}
