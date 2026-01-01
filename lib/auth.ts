// lib/auth.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options"; // ✅ AMAN
import { redirect } from "next/navigation";

type UserRole = "admin" | "cashier";

export const ROLES = {
  CASHIER: "cashier" as const,
  ADMIN: "admin" as const,
} as const;

export const PERMISSIONS = {
  ACCESS_CASHIER: ["cashier", "admin"] as const,
  ACCESS_ORDERS: ["cashier", "admin"] as const,
  ACCESS_REPORT: ["cashier", "admin"] as const,
  EXPORT_REPORT: ["admin"] as const,
  MANAGE_PRODUCTS: ["admin"] as const,
} as const;

// ✅ Helper: cek akses berdasarkan role & permission
function canAccess(permission: keyof typeof PERMISSIONS, role: UserRole): boolean {
  switch (permission) {
    case "EXPORT_REPORT":
    case "MANAGE_PRODUCTS":
      return role === ROLES.ADMIN;
    default:
      return role === ROLES.CASHIER || role === ROLES.ADMIN;
  }
}

export async function requirePermission(permissionKey: keyof typeof PERMISSIONS) {
  const session = await getServerSession(authOptions);

  // ✅ Proteksi: pastikan session dan user ada
  if (!session || !session.user) {
    redirect("/login");
  }

  // ✅ Pastikan role valid
  const user = session.user as { role?: string };
  const userRole = user.role;
  if (userRole !== "cashier" && userRole !== "admin") {
    redirect("/login");
  }

  // ✅ Cek permission
  if (!canAccess(permissionKey, userRole)) {
    redirect("/login");
  }

  return session;
}

export function hasPermission(userRole: string, permissionKey: keyof typeof PERMISSIONS): boolean {
  if (userRole !== "cashier" && userRole !== "admin") return false;
  return canAccess(permissionKey, userRole as UserRole);
}
