"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user || !isAdminUser(session.user)) {
      router.push("/login");
    }
  }, [status, session, router]);

  // Define a more complete admin user type
  type AdminUser = {
    role: 'admin';
    name?: string;
    username?: string;
    email?: string;
  };

  // Type guard function to check if user is admin
  function isAdminUser(user: any): user is AdminUser {
    return user && user.role === 'admin';
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="text-slate-700 flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-slate-300 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Memuat panel admin...</p>
        </div>
      </div>
    );
  }

  if (!session?.user || !isAdminUser(session.user)) {
    return null;
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "User", href: "/admin/users", icon: "👥" },
    { name: "Produk", href: "/admin/products", icon: "📦" },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-16"} bg-slate-900 text-white transition-all duration-300 flex flex-col min-h-screen shadow-lg`}>
        <div className="p-4 border-b border-slate-700">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">A</div>
              <h1 className="text-lg font-bold">Admin Panel</h1>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="bg-emerald-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === item.href ? "bg-emerald-600 text-white shadow-sm" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
            >
              <span className="text-lg">{item.icon}</span>
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Toggle sidebar (opsional di mobile) */}
        <div className="p-4 border-t border-slate-700 md:hidden">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full text-center text-sm text-slate-400 hover:text-white">
            {isSidebarOpen ? "« Sembunyi" : "Tampilkan »"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600">
              ☰
            </button>
            <h2 className="font-semibold text-slate-800">Admin</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Dashboard Utama */}
            <a
              href="https://06ns6l3d-3000.asse.devtunnels.ms"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium"
              title="Kembali ke Dashboard Utama"
            >
              🏠 Dashboard Utama
            </a>

            {/* User Info & Logout */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end text-right">
                <p className="text-sm font-medium text-slate-800">{(session.user as AdminUser)?.username || (session.user as AdminUser)?.name || "Admin"}</p>
                <p className="text-xs text-emerald-600 font-medium">Admin</p>
              </div>

              <button onClick={handleLogout} className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Keluar" aria-label="Logout">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
