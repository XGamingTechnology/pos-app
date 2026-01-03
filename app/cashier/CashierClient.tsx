"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

type UserRole = "admin" | "cashier";

type OrderItem = {
  product_id: string;
  product_name: string;
  qty: number;
  price: number;
  subtotal: number;
};

type Order = {
  id: string;
  customer_name?: string;
  table_number?: string;
  type_order?: "dine_in" | "takeaway";
  status: "DRAFT" | "PAID" | "CANCELED";
  items: OrderItem[];
};

type User = {
  id: string;
  username: string;
  role: UserRole;
  backendToken: string | null;
  backendRefreshToken: string | null;
};

// ✅ Tambahkan `color` di tipe Product
type Product = { id: string; name: string; price: number; category: string; color?: string };
type CartItem = { id: string; name: string; price: number; qty: number };

type Props = {
  user: User;
  initialProducts: Product[];
  initialOrder?: Order | null;
};

export default function CashierClient({ user, initialProducts, initialOrder }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [products] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [orderType, setOrderType] = useState<"dine_in" | "takeaway">("dine_in");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [cartAnimationKey, setCartAnimationKey] = useState(0);

  useEffect(() => {
    if (initialOrder) {
      const itemMap = new Map<string, CartItem>();

      initialOrder.items.forEach((item) => {
        if (itemMap.has(item.product_id)) {
          const existing = itemMap.get(item.product_id)!;
          itemMap.set(item.product_id, {
            ...existing,
            qty: existing.qty + item.qty,
          });
        } else {
          itemMap.set(item.product_id, {
            id: item.product_id,
            name: item.product_name,
            price: item.price,
            qty: item.qty,
          });
        }
      });

      const items = Array.from(itemMap.values());
      setCartItems(items);
      setCustomerName(initialOrder.customer_name || "");
      setTableNumber(initialOrder.table_number || "");
      setOrderType(initialOrder.type_order === "takeaway" ? "takeaway" : "dine_in");

      if (typeof window !== "undefined") {
        localStorage.setItem("editingOrderId", initialOrder.id);
      }
    } else {
      setCartItems([]);
      setCustomerName("");
      setTableNumber("");
      setOrderType("dine_in");
    }
  }, [initialOrder?.id]); // Only re-run when initialOrder.id changes to avoid infinite loop

  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add("dark");
  }, []); // Add empty dependency array to run only once on mount

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };
  const categoryColorMap = new Map<string, string>();
  products.forEach((p) => {
    if (p.category && p.color) {
      if (!categoryColorMap.has(p.category)) {
        categoryColorMap.set(p.category, p.color);
      }
    }
  });

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) && (category === "all" || p.category === category));

  const addToCart = (p: Product) => {
    setCartItems((prev) => {
      const existIndex = prev.findIndex((i) => i.id === p.id);
      if (existIndex !== -1) {
        const updated = [...prev];
        updated[existIndex] = { ...updated[existIndex], qty: updated[existIndex].qty + 1 };
        return updated;
      } else {
        setCartAnimationKey((k) => k + 1);
        return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
      }
    });
  };

  const increaseQty = (id: string) => {
    setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  };

  const decreaseQty = (id: string) => {
    setCartItems((prev) => {
      const updated = prev.map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i));
      return updated.filter((i) => i.qty > 0);
    });
  };

  const removeItem = (id: string) => setCartItems((prev) => prev.filter((i) => i.id !== id));

  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const isEditing = typeof window !== "undefined" && localStorage.getItem("editingOrderId") !== null;

  const saveOrder = async () => {
    if (cartItems.length === 0) return alert("Keranjang kosong");

    if (orderType === "dine_in" && (!tableNumber || tableNumber === "")) {
      return alert("Nomor meja wajib diisi untuk makan di tempat");
    }

    const editingOrderId = typeof window !== "undefined" ? localStorage.getItem("editingOrderId") : null;
    const API_URL = process.env.NEXT_PUBLIC_API_URL!;

    try {
      const payload = {
        customer_name: customerName.trim() || "-",
        table_number: orderType === "dine_in" ? tableNumber : null,
        type_order: orderType,
        items: cartItems.map((i) => ({
          product_id: i.id,
          qty: i.qty,
        })),
      };

      let res;
      if (editingOrderId) {
        res = await fetch(`${API_URL}/api/orders/${editingOrderId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.backendToken}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_URL}/api/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.backendToken}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Gagal menyimpan order");

      setCartItems([]);
      setCustomerName("");
      setTableNumber("");
      setOrderType("dine_in");
      if (typeof window !== "undefined") {
        localStorage.removeItem("editingOrderId");
      }

      if (editingOrderId) {
        router.push(`/orders/${editingOrderId}`);
      } else {
        router.push("/orders");
      }
    } catch (err) {
      console.error("Save order error:", err);
      alert("Terjadi kesalahan saat menyimpan");
    }
  };

  const cancelEdit = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("editingOrderId");
    }
    setCartItems([]);
    setCustomerName("");
    setTableNumber("");
    setOrderType("dine_in");
    router.push("/orders");
  };

  const handleLogout = () => signOut({ callbackUrl: "/login" });

  // ✅ Helper: fallback warna jika tidak ada atau tidak valid
  const getBackgroundColor = (color: string | undefined): string => {
    if (color && /^#[0-9A-F]{6}$/i.test(color)) {
      return color;
    }
    return "#6B7280"; // gray-500
  };

  // Tambahkan di dalam fungsi CashierClient, setelah useState lainnya

  const [draftOrderCount, setDraftOrderCount] = useState(0);
  const [loadingDraftCount, setLoadingDraftCount] = useState(true);

  // Ambil jumlah draft order
  useEffect(() => {
    const fetchDraftCount = async () => {
      if (!user.backendToken) {
        setLoadingDraftCount(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${user.backendToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const drafts = data.data?.filter((order: any) => order.status === "DRAFT") || [];
          setDraftOrderCount(drafts.length);
        }
      } catch (err) {
        console.error("Gagal memuat jumlah draft order:", err);
      } finally {
        setLoadingDraftCount(false);
      }
    };

    fetchDraftCount();

    // Opsional: polling setiap 30 detik
    const interval = setInterval(fetchDraftCount, 30000);
    return () => clearInterval(interval);
  }, [user.backendToken]); // Ensure backendToken dependency is properly tracked

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Mobile cart bar */}
      {cartItems.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-lg">
          <div className="p-3 flex justify-between items-center">
            <span className="text-sm font-medium">
              {cartItems.length} item • Rp {total.toLocaleString("id-ID")}
            </span>
            <button onClick={() => router.push("/cart")} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm">
              Lihat Keranjang
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Cart — Desktop only */}
      <aside className="hidden md:flex md:w-80 lg:w-96 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex-col transition-colors duration-200">
        <div className="p-4 border-b dark:border-gray-700 bg-emerald-50 dark:bg-emerald-900/20 transition-colors duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium uppercase tracking-wider">{isEditing ? "Edit Order" : "Order"}</p>
              <p className="font-bold text-emerald-800 dark:text-emerald-300">{isEditing ? "Sedang Mengedit" : "Draft"}</p>
            </div>
            {cartItems.length > 0 && <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">{cartItems.length}</span>}
          </div>
        </div>

        <div className="p-4 space-y-4 border-b dark:border-gray-700">
          <div>
            <label htmlFor="customerName" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Nama Pelanggan
            </label>
            <input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Contoh: Budi"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label htmlFor="orderType" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Tipe Order *
            </label>
            <select
              id="orderType"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as "dine_in" | "takeaway")}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="dine_in">Makan di Tempat</option>
              <option value="takeaway">Bawa Pulang</option>
            </select>
          </div>

          {orderType === "dine_in" && (
            <div>
              <label htmlFor="tableNumber" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Nomor Meja *
              </label>
              <select
                id="tableNumber"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">Pilih Meja</option>
                {[...Array(30)].map((_, i) => (
                  <option key={i + 1} value={String(i + 1)}>
                    Meja {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <p className="text-sm">🛒 Keranjang masih kosong</p>
            </div>
          ) : (
            <div key={cartAnimationKey}>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b dark:border-gray-700 pb-2 animate-fadeInUp">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Rp {item.price.toLocaleString("id-ID")}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                      disabled={item.qty <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val > 0) {
                          setCartItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, qty: val } : i)));
                        }
                      }}
                      className="w-12 text-center text-sm font-medium bg-transparent border border-gray-300 dark:border-gray-600 rounded"
                    />
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                    >
                      +
                    </button>
                    <button onClick={() => removeItem(item.id)} className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" aria-label="Hapus item">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
          <div className="flex justify-between font-bold text-gray-800 dark:text-gray-200 text-lg">
            <span>Total</span>
            <span className="text-emerald-700 dark:text-emerald-400">Rp {total.toLocaleString("id-ID")}</span>
          </div>

          <button
            onClick={saveOrder}
            disabled={cartItems.length === 0}
            className={`w-full mt-3 py-3 rounded-lg font-semibold text-white transition ${
              cartItems.length === 0 ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-700 dark:hover:bg-emerald-600"
            }`}
          >
            💾 {isEditing ? "Perbarui Order" : "Simpan Order"}
          </button>

          {isEditing && (
            <button onClick={cancelEdit} className="w-full mt-2 text-gray-600 hover:text-gray-900 text-sm">
              Batal Edit
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-lg text-gray-800 dark:text-gray-200">POS Kasir</h1>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-2">
              {/* Dashboard Utama — selalu muncul */}
              <a
                href="https://06ns6l3d-3000.asse.devtunnels.ms"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-100 transition flex items-center gap-1"
                title="Kembali ke Dashboard Utama"
              >
                🏠 Dashboard
              </a>

              {/* Menu Order dengan Badge */}
              <Link
                href="/orders"
                className={`px-3 py-1.5 text-sm rounded-lg relative flex items-center gap-1 transition ${
                  pathname === "/orders" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                🧾 Order
                {!loadingDraftCount && draftOrderCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full animate-pulse">{draftOrderCount}</span>
                )}
              </Link>

              {/* Laporan — selalu muncul */}
              <Link href="/report" className="px-3 py-1.5 text-sm rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-100 transition">
                📊 Laporan
              </Link>

              {/* Admin — HANYA JIKA ROLE = "admin" */}
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="px-3 py-1.5 text-sm rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-800 dark:hover:text-purple-300 transition flex items-center gap-1"
                >
                  👤 Admin
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-2.5">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex flex-col items-end text-right">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.username}</p>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                  </div>
                </div>

                <button onClick={handleLogout} className="p-2 rounded-full bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition" title="Keluar">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-5 overflow-y-auto">
          <div className="mb-4 md:mb-5">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Cari produk..."
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* ✅ Tombol kategori dengan warna dinamis (inline style) */}
          <div className="flex gap-2 mb-4 md:mb-5 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const isActive = category === cat;

              if (cat === "all") {
                return (
                  <button
                    key={`category-${cat}`}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition ${
                      isActive ? "bg-emerald-600 text-white" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    Semua
                  </button>
                );
              }

              // Ambil warna representatif untuk kategori ini
              const categoryColor = categoryColorMap.get(cat) || "#6B7280"; // fallback ke gray-500

              return (
                <button
                  key={`category-${cat}`}
                  onClick={() => setCategory(cat)}
                  // Gunakan inline style untuk warna aktif
                  style={{
                    backgroundColor: isActive ? categoryColor : undefined,
                    color: isActive ? "white" : undefined,
                  }}
                  className={`px-3 py-1.5 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition ${
                    isActive
                      ? "" // warna diatur via inline style
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">Tidak ada produk ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  // ✅ WARNA DARI DATABASE → INLINE STYLE
                  style={{
                    backgroundColor: getBackgroundColor(product.color),
                  }}
                  className="text-white rounded-xl p-3 md:p-4 text-left shadow-sm hover:shadow-md transition border border-transparent hover:border-white dark:hover:border-gray-300 animate-fadeIn"
                >
                  <p className="font-semibold text-xs md:text-sm leading-tight">{product.name}</p>
                  <p className="font-bold mt-1 text-sm">Rp {product.price.toLocaleString("id-ID")}</p>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
