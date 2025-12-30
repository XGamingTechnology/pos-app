"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Toaster, toast } from "sonner"; // ✅ Notifikasi profesional

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 🔍 Toggle password visibility
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("⚠️ Username dan password wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: true,
        username,
        password,
      });

      if (result?.error) {
        toast.error("❌ Username atau password salah", {
          description: "Periksa kembali kredensial Anda.",
        });
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      toast.error("🔌 Gagal terhubung ke server", {
        description: "Periksa koneksi internet Anda.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Toast notifikasi */}
      <Toaster position="top-center" richColors />

      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-6">
          {/* LOGO / HEADER */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mb-4">
              <span className="text-xl">💳</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Login POS</h1>
            <p className="text-sm text-slate-600 mt-1">Masuk untuk mulai transaksi</p>
          </div>

          <div className="space-y-5">
            {/* USERNAME */}
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-slate-700 mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Contoh: kasir123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900 placeholder:text-slate-400"
                disabled={loading}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900 placeholder:text-slate-400"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.122 2.871-.349m-7.753-3.294A9.428 9.428 0 012.5 12c0-1.13.144-2.228.409-3.294m13.082 6.589A9.428 9.428 0 0021.5 12c0-1.13-.144-2.228-.409-3.294m0 0A8.99 8.99 0 0112 21c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8z"
                      />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-3.5 rounded-lg font-semibold text-white transition-all shadow-sm ${
                loading ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] shadow-emerald-100 hover:shadow-md"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
              ) : (
                "Masuk ke POS"
              )}
            </button>
          </div>

          {/* FOOTER (opsional) */}
          <p className="text-xs text-slate-500 text-center">© {new Date().getFullYear()} Sistem POS</p>
        </div>
      </div>
    </>
  );
}
