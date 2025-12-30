"use client";

import { useState, useEffect, useRef, useMemo } from "react"; // ✅ Tambahkan useMemo
import { CheckCircle, XCircle, Package, Pencil, Trash2, Tag, Eye, EyeOff, Plus } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string | null;
  color?: string | null;
  code?: string | null;
  type?: string | null;
  active: boolean;
};

type Category = {
  id: string;
  name: string;
  color: string;
};

type CurrentUser = {
  id: string;
  username: string;
  role: "admin" | "cashier";
  backendToken: string | null;
};

type Props = {
  currentUser: CurrentUser;
  initialProducts: Product[];
  initialCategories: Category[];
};

export default function ProductManagementClient({ currentUser, initialProducts, initialCategories }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    code: "",
    type: "",
  });
  const [newCategory, setNewCategory] = useState({ name: "", color: "#6B7280" });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [highlightNewId, setHighlightNewId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const newProductRef = useRef<HTMLTableRowElement>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    if (highlightNewId && newProductRef.current) {
      newProductRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setTimeout(() => setHighlightNewId(null), 3000);
    }
  }, [highlightNewId]);

  // === FETCH KATEGORI ===
  useEffect(() => {
    const fetchCategories = async () => {
      if (!currentUser.backendToken) return;
      try {
        const res = await fetch(`${API_URL}/api/admin/products/categories-with-color`, {
          headers: { Authorization: `Bearer ${currentUser.backendToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          const categoriesWithId = (data.data || []).map((cat: any, idx: number) => ({
            id: `cat-${idx}-${cat.name}`,
            name: cat.name,
            color: cat.color || "#6B7280",
          }));
          setCategories(categoriesWithId);
        }
      } catch (err) {
        showNotification("error", "Gagal memuat daftar kategori");
      }
    };
    fetchCategories();
  }, [currentUser.backendToken]);

  // === SORTING ===
  const sortedProducts = useMemo(() => {
    let sortableProducts = [...products];
    if (sortConfig !== null) {
      sortableProducts.sort((a, b) => {
        // Pastikan nilai tidak null/undefined
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProducts;
  }, [products, sortConfig]);

  const filteredProducts = useMemo(() => {
    return sortedProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.code && product.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [sortedProducts, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (key: keyof Product) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // === PRODUK ===
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim() || !newProduct.price) {
      showNotification("error", "Nama produk dan harga wajib diisi");
      return;
    }
    const price = parseInt(newProduct.price);
    if (isNaN(price) || price <= 0) {
      showNotification("error", "Harga harus angka positif");
      return;
    }

    const selectedCategory = categories.find((c) => c.name === newProduct.category);
    const categoryColor = selectedCategory?.color || null;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.backendToken}`,
        },
        body: JSON.stringify({
          name: newProduct.name.trim(),
          price,
          category: newProduct.category || null,
          color: categoryColor,
          code: newProduct.code?.trim() || null,
          type: newProduct.type?.trim() || null,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        const productsRes = await fetch(`${API_URL}/api/admin/products`, {
          headers: { Authorization: `Bearer ${currentUser.backendToken}` },
        });
        const productsData = await productsRes.json();
        const updatedProducts = Array.isArray(productsData.data) ? productsData.data : [];
        setProducts(updatedProducts);

        // ✅ Cari produk baru berdasarkan name & price (lebih aman)
        const newProductItem = updatedProducts.find((p: Product) => p.name === newProduct.name.trim() && p.price === price);
        if (newProductItem) {
          setHighlightNewId(newProductItem.id);
          setCurrentPage(Math.ceil(updatedProducts.length / ITEMS_PER_PAGE));
        }

        setNewProduct({ name: "", price: "", category: "", code: "", type: "" });
        showNotification("success", "✅ Produk berhasil ditambahkan!");
      } else {
        showNotification("error", result.message || "Gagal menambah produk");
      }
    } catch (err: any) {
      showNotification("error", "Terjadi kesalahan saat menambah produk");
    } finally {
      setIsLoading(false);
    }
  };

  const saveProduct = async (product: Product) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.backendToken}`,
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const productsRes = await fetch(`${API_URL}/api/admin/products`, {
          headers: { Authorization: `Bearer ${currentUser.backendToken}` },
        });
        const productsData = await productsRes.json();
        setProducts(Array.isArray(productsData.data) ? productsData.data : []);
        setEditingProduct(null);
        showNotification("success", "✅ Produk berhasil diperbarui!");
      } else {
        const result = await response.json();
        showNotification("error", result.message || "Gagal memperbarui produk");
      }
    } catch (err: any) {
      showNotification("error", "Terjadi kesalahan saat memperbarui produk");
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus produk "${name}"?`)) return;
    try {
      const response = await fetch(`${API_URL}/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${currentUser.backendToken}` },
      });
      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
        showNotification("success", "✅ Produk berhasil dihapus!");
      } else {
        const result = await response.json();
        showNotification("error", result.message || "Gagal menghapus produk");
      }
    } catch (err: any) {
      showNotification("error", "Terjadi kesalahan saat menghapus produk");
    }
  };

  // === KATEGORI ===
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/products/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.backendToken}`,
        },
        body: JSON.stringify({
          name: newCategory.name.trim(),
          color: newCategory.color,
        }),
      });
      if (res.ok) {
        const newCat = { id: `new-${Date.now()}`, ...newCategory };
        setCategories([...categories, newCat]);
        setNewCategory({ name: "", color: "#6B7280" });
        showNotification("success", "✅ Kategori berhasil ditambahkan!");
      } else {
        const err = await res.json();
        showNotification("error", err.message || "Gagal menambah kategori");
      }
    } catch (err: any) {
      showNotification("error", "Terjadi kesalahan saat menambah kategori");
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`Yakin ingin menghapus kategori "${category.name}"?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/products/categories`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.backendToken}`,
        },
        body: JSON.stringify({ name: category.name }),
      });
      if (res.ok) {
        setCategories(categories.filter((c) => c.name !== category.name));
        setProducts(products.map((p) => (p.category === category.name ? { ...p, category: null, color: null } : p)));
        showNotification("success", `✅ Kategori "${category.name}" dihapus`);
      } else {
        const err = await res.json();
        showNotification("error", err.message || "Gagal menghapus kategori");
      }
    } catch (err: any) {
      showNotification("error", "Terjadi kesalahan saat menghapus kategori");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Notifikasi */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 ${notification.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {notification.type === "success" ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          {notification.message}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">📦 Manajemen Produk & Kategori</h1>
        <p className="text-slate-600 mt-2">Kelola produk, kategori, dan status aktivasi.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button onClick={() => setActiveTab("products")} className={`px-4 py-2 font-medium ${activeTab === "products" ? "text-emerald-700 border-b-2 border-emerald-700" : "text-slate-500 hover:text-slate-700"}`}>
          Produk
        </button>
        <button onClick={() => setActiveTab("categories")} className={`px-4 py-2 font-medium ${activeTab === "categories" ? "text-emerald-700 border-b-2 border-emerald-700" : "text-slate-500 hover:text-slate-700"}`}>
          Kategori
        </button>
      </div>

      {/* === TAB PRODUK === */}
      {activeTab === "products" && (
        <>
          {/* Form & Pencarian */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Form Tambah Produk */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                  <Plus className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Tambah Produk Baru</h2>
              </div>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-2">Nama Produk *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Nasi Goreng"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-800 mb-2">Harga *</label>
                    <input
                      type="number"
                      placeholder="25000"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-800 mb-2">Kategori</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name} style={{ backgroundColor: cat.color, color: "white" }}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {isLoading ? "Memproses..." : "➕ Tambah Produk"}
                </button>
              </form>
            </div>

            {/* Pencarian */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Cari Produk</h2>
              <input
                type="text"
                placeholder="Cari nama, kategori, atau kode..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Tabel Produk */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Daftar Produk</h2>
              <p className="text-slate-600 text-sm mt-1">Total {filteredProducts.length} produk</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th onClick={() => handleSort("name")} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer">
                      Produk {sortConfig?.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th onClick={() => handleSort("category")} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer">
                      Kategori {sortConfig?.key === "category" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th onClick={() => handleSort("price")} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer">
                      Harga {sortConfig?.key === "price" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {currentProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        Tidak ada produk ditemukan.
                      </td>
                    </tr>
                  ) : (
                    currentProducts.map((product) => {
                      const isHighlighted = highlightNewId === product.id;
                      const isEditing = editingProduct?.id === product.id;
                      const editForm = isEditing ? editingProduct : product;

                      return (
                        <tr key={product.id} ref={isHighlighted ? newProductRef : null} className={`hover:bg-slate-50 transition-colors ${isHighlighted ? "bg-emerald-50" : ""}`}>
                          {/* Kolom Produk (Nama & Kode) */}
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editForm.name}
                                  onChange={(e) => setEditingProduct({ ...editForm, name: e.target.value })}
                                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                                  placeholder="Nama produk"
                                />
                                <input
                                  type="text"
                                  value={editForm.code || ""}
                                  onChange={(e) => setEditingProduct({ ...editForm, code: e.target.value || null })}
                                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm mt-1"
                                  placeholder="Kode (opsional)"
                                />
                              </div>
                            ) : (
                              <>
                                <div className="font-medium text-slate-900">{product.name}</div>
                                {product.code && <div className="text-xs text-slate-500 mt-1">Kode: {product.code}</div>}
                              </>
                            )}
                          </td>

                          {/* Kolom Kategori */}
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <select
                                value={editForm.category || ""}
                                onChange={(e) => {
                                  const val = e.target.value || null;
                                  const cat = categories.find((c) => c.name === val);
                                  setEditingProduct({
                                    ...editForm,
                                    category: val,
                                    color: cat?.color || null,
                                  });
                                }}
                                className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                              >
                                <option value="">Tanpa Kategori</option>
                                {categories.map((cat) => (
                                  <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                  </option>
                                ))}
                              </select>
                            ) : product.category ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: product.color || "#6B7280" }}>
                                {product.category}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          {/* Kolom Harga */}
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editForm.price}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val)) {
                                    setEditingProduct({ ...editForm, price: val });
                                  }
                                }}
                                className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                                min="1"
                              />
                            ) : (
                              <span className="font-medium text-slate-900">Rp {product.price.toLocaleString("id-ID")}</span>
                            )}
                          </td>

                          {/* Kolom Status */}
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-700">Aktif:</span>
                                <button
                                  type="button"
                                  onClick={() => setEditingProduct({ ...editForm, active: !editForm.active })}
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${editForm.active ? "bg-emerald-500" : "bg-slate-300"}`}
                                >
                                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${editForm.active ? "translate-x-4" : "translate-x-1"}`} />
                                </button>
                              </div>
                            ) : (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{product.active ? "Aktif" : "Nonaktif"}</span>
                            )}
                          </td>

                          {/* Kolom Aksi */}
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <div className="flex gap-2">
                                <button onClick={() => editForm && saveProduct(editForm)} className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700">
                                  Simpan
                                </button>
                                <button onClick={() => setEditingProduct(null)} className="px-3 py-1.5 bg-slate-600 text-white text-sm rounded-md hover:bg-slate-700">
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <button onClick={() => setEditingProduct(product)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded" title="Edit produk">
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDeleteProduct(product.id, product.name)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hapus produk">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-sm text-slate-700">
                  Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} dari {filteredProducts.length} produk
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    Sebelumnya
                  </button>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`px-3 py-1.5 rounded-md text-sm ${currentPage === pageNum ? "bg-emerald-600 text-white" : "border hover:bg-slate-100"}`}>
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && currentPage > 3 && <span className="px-3 py-1.5 text-sm text-slate-500">...</span>}
                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* === TAB KATEGORI === */}
      {activeTab === "categories" && (
        <>
          {/* Form Kategori */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
                <Tag className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Tambah Kategori Baru</h2>
            </div>
            <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">Nama Kategori *</label>
                <input
                  type="text"
                  placeholder="Contoh: Makanan Utama"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">Warna *</label>
                <div className="flex gap-2">
                  <input type="color" value={newCategory.color} onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })} className="w-12 h-10 border border-slate-300 rounded cursor-pointer" />
                  <input
                    type="text"
                    value={newCategory.color}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-F]{6}$/i.test(val)) {
                        setNewCategory({ ...newCategory, color: val });
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm"
                    placeholder="#6B7280"
                  />
                </div>
              </div>
              <button type="submit" className="md:col-span-2 mt-2 w-full md:w-auto px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2">
                ➕ Tambah Kategori
              </button>
            </form>
          </div>

          {/* Daftar Kategori */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Daftar Kategori</h2>
            {categories.length === 0 ? (
              <p className="text-slate-500">Belum ada kategori.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: cat.color }}>
                    <span className="w-5 h-5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                    <span className="font-medium text-slate-900">{cat.name}</span>
                    <button onClick={() => handleDeleteCategory(cat)} className="ml-auto p-1 text-red-600 hover:bg-red-50 rounded" title="Hapus">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
