"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, UserPlus, UserCheck, UserX, Pencil, Key, Trash2 } from "lucide-react";
import { UserRole } from "@/types/next-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// UUID validation helper
const isValidUuid = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

type User = {
  id: string; // ✅ Harus UUID string
  username: string;
  role: UserRole;
  active: boolean;
};

type CurrentUser = {
  id: string; // ✅ UUID dari NextAuth / token
  username: string;
  role: UserRole;
  backendToken: string | null;
};

export default function Usermanagementclient({ currentUser, initialUsers }: { currentUser: CurrentUser; initialUsers: User[] }) {
  // ✅ Pastikan semua `id` di initialUsers valid UUID
  useEffect(() => {
    console.log("📋 Daftar semua user ID:");

    if (initialUsers.length === 0) {
      console.log("   → Tidak ada user.");
    } else {
      initialUsers.forEach((user) => {
        console.log(` - ${user.id} → ${isValidUuid(user.id) ? "✅ valid" : "❌ INVALID"}`);
      });
    }

    const invalid = initialUsers.find((u) => !isValidUuid(u.id));
    if (invalid) {
      console.warn("Invalid UUID detected in initial user data:", invalid);
    } else {
      console.log("✅ Semua user memiliki UUID yang valid.");
    }
  }, [initialUsers]);

  const [users, setUsers] = useState<User[]>(initialUsers);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "cashier" as const,
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resetPasswordId, setResetPasswordId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // ✅ Tambah User
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username.trim() || !newUser.password.trim()) {
      showNotification("error", "Username dan password wajib diisi");
      return;
    }
    if (newUser.password.length < 6) {
      showNotification("error", "Password minimal 6 karakter"); // ✅ DIPERBAIKI: hapus spasi di "error"
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.backendToken}`,
        },
        body: JSON.stringify({
          username: newUser.username.trim(),
          password: newUser.password,
          role: newUser.role,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        const addedUser = { ...result.user, active: true };
        if (!isValidUuid(addedUser.id)) {
          console.error("Received invalid UUID from backend:", addedUser.id);
        }
        setUsers([...users, addedUser]);
        setNewUser({ username: "", password: "", role: "cashier" });
        showNotification("success", "User berhasil ditambahkan!");
      } else {
        showNotification("error", result.message || "Gagal menambah user");
      }
    } catch (err) {
      console.error("Add user error:", err);
      showNotification("error", "Terjadi kesalahan saat menambah user");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Toggle Aktif/Nonaktif
  const handleToggleActive = async (id: string, currentActive: boolean) => {
    if (!isValidUuid(id)) {
      showNotification("error", "ID user tidak valid");
      return;
    }
    if (!confirm(`Yakin ingin ${currentActive ? "menonaktifkan" : "mengaktifkan"} user ini?`)) return;

    try {
      const username = users.find((u) => u.id === id)?.username || "";
      const role = users.find((u) => u.id === id)?.role || "cashier";

      const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.backendToken}`,
        },
        body: JSON.stringify({ username, role, active: !currentActive }),
      });

      const result = await res.json();
      if (res.ok) {
        setUsers(users.map((u) => (u.id === id ? { ...u, active: !currentActive } : u)));
        showNotification("success", `User berhasil ${!currentActive ? "diaktifkan" : "dinonaktifkan"}!`);
      } else {
        showNotification("error", result.message || "Gagal mengubah status user");
      }
    } catch (err) {
      console.error("Toggle active error:", err);
      showNotification("error", "Terjadi kesalahan saat mengubah status");
    }
  };

  // ✅ Edit User
  const handleEditUser = (user: User) => {
    if (!isValidUuid(user.id)) {
      showNotification("error", "ID user tidak valid");
      return;
    }
    setEditingUser({ ...user });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!editingUser.username.trim()) {
      showNotification("error", "Username wajib diisi");
      return;
    }
    if (!isValidUuid(editingUser.id)) {
      showNotification("error", "ID user tidak valid");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.backendToken}`,
        },
        body: JSON.stringify({
          username: editingUser.username.trim(),
          role: editingUser.role,
          active: editingUser.active,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
        setEditingUser(null);
        showNotification("success", "User berhasil diperbarui!");
      } else {
        showNotification("error", result.message || "Gagal memperbarui user");
      }
    } catch (err) {
      console.error("Edit user error:", err);
      showNotification("error", "Terjadi kesalahan saat memperbarui user");
    }
  };

  // ✅ Reset Password
  const handleResetPassword = async () => {
    if (!resetPasswordId || !isValidUuid(resetPasswordId)) {
      showNotification("error", "ID user tidak valid");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      showNotification("error", "Password minimal 6 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotification("error", "Password konfirmasi tidak cocok");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/users/${resetPasswordId}/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.backendToken}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const result = await res.json();
      if (res.ok) {
        setResetPasswordId(null);
        setNewPassword("");
        setConfirmPassword("");
        showNotification("success", "Password berhasil direset!");
      } else {
        showNotification("error", result.message || "Gagal reset password");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      showNotification("error", "Terjadi kesalahan saat reset password");
    }
  };

  // ✅ Hapus User
  const handleDeleteUser = async (id: string, username: string) => {
    console.log("🔍 DELETE ID:", JSON.stringify(id));
    if (!isValidUuid(id)) {
      showNotification("error", "ID user tidak valid");
      return;
    }
    if (!confirm(`Yakin ingin menghapus user "${username}"?\nTindakan ini tidak bisa dibatalkan!`)) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser.backendToken}`,
        },
      });

      const result = await res.json();
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
        showNotification("success", "User berhasil dihapus!");
      } else {
        showNotification("error", result.message || "Gagal menghapus user");
      }
    } catch (err) {
      console.error("Delete user error:", err);
      showNotification("error", "Terjadi kesalahan saat menghapus user");
    }
  };

  const isCurrentUser = (userId: string) => currentUser.id === userId;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Notifikasi */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 ${notification.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {notification.type === "success" ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          {notification.message}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">👨‍💼 Manajemen User</h1>
        <p className="text-gray-600 mt-2">Kelola akun user sistem POS. Tambah, edit, reset password, atau nonaktifkan akses user.</p>
      </div>

      {/* Form Tambah User */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
            <UserPlus className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Tambah User Baru</h2>
        </div>

        <form onSubmit={handleAddUser}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-800 mb-2">
                Username *
              </label>
              <input
                id="username"
                type="text"
                placeholder="Contoh: kasir_01"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
                Password *
              </label>
              <input
                id="password"
                type="password"
                placeholder="Minimal 6 karakter"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-800 mb-2">
                Role *
              </label>
              <select
                id="role"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="cashier">Kasir</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Memproses...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Tambah User
              </>
            )}
          </button>
        </form>
      </div>

      {/* Form Edit User */}
      {editingUser && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
              <Pencil className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Edit User: {editingUser.username}</h2>
          </div>

          <form onSubmit={handleSaveEdit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Username *</label>
                <input type="text" value={editingUser.username} onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Role *</label>
                <select value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900">
                  <option value="cashier">Kasir</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Status</label>
                <select
                  value={editingUser.active ? "active" : "inactive"}
                  onChange={(e) => setEditingUser({ ...editingUser, active: e.target.value === "active" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700">
                Simpan Perubahan
              </button>
              <button type="button" onClick={() => setEditingUser(null)} className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Form Reset Password */}
      {resetPasswordId && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
              <Key className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Reset Password</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Password Baru *</label>
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                minLength={6}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Konfirmasi Password *</label>
              <input
                type="password"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                minLength={6}
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleResetPassword} className="px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700">
              Reset Password
            </button>
            <button
              onClick={() => {
                setResetPasswordId(null);
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Daftar User */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
              <UserCheck className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Daftar User</h2>
          </div>
          <p className="text-gray-600 text-sm mt-2">Total {users.length} user terdaftar</p>
        </div>

        {users.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UserX className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada user</h3>
            <p className="text-gray-500">Tambahkan user baru menggunakan form di atas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      {isCurrentUser(user.id) && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 mt-1">
                          <UserCheck className="h-3 w-3" />
                          Anda
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
                        {user.role === "admin" ? "Administrator" : "Kasir"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {user.active ? (
                          <>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                            Aktif
                          </>
                        ) : (
                          <>
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></div>
                            Nonaktif
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          disabled={isCurrentUser(user.id)}
                          className={`p-1.5 rounded-lg transition-colors ${isCurrentUser(user.id) ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100"}`}
                          title={isCurrentUser(user.id) ? "Tidak bisa edit diri sendiri" : "Edit user"}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => {
                            setResetPasswordId(user.id);
                            setNewPassword("");
                            setConfirmPassword("");
                          }}
                          disabled={isCurrentUser(user.id)}
                          className={`p-1.5 rounded-lg transition-colors ${isCurrentUser(user.id) ? "text-gray-400 cursor-not-allowed" : "text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100"}`}
                          title={isCurrentUser(user.id) ? "Tidak bisa reset password sendiri" : "Reset password"}
                        >
                          <Key className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleToggleActive(user.id, user.active)}
                          disabled={isCurrentUser(user.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isCurrentUser(user.id) ? "text-gray-400 cursor-not-allowed" : user.active ? "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100" : "text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100"
                          }`}
                          title={isCurrentUser(user.id) ? "Tidak bisa ubah status sendiri" : user.active ? "Nonaktifkan user" : "Aktifkan user"}
                        >
                          {user.active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>

                        <button
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          disabled={isCurrentUser(user.id)}
                          className={`p-1.5 rounded-lg transition-colors ${isCurrentUser(user.id) ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100"}`}
                          title={isCurrentUser(user.id) ? "Tidak bisa hapus diri sendiri" : "Hapus user"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
