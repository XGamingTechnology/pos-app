// app/admin/users/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import UserManagementClient from "./UserManagementClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Helper: validasi UUID
const isValidUuid = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return redirect("/login");
  }

  let users: { id: string; username: string; role: "admin" | "cashier"; active: boolean }[] = [];

  try {
    const res = await fetch(`${API_URL}/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        // ✅ Pastikan setiap user memiliki `id` berupa UUID yang valid
        const validatedUsers = data.data.filter((user: any) => {
          if (!user.id || typeof user.id !== "string") {
            console.error("User tanpa ID atau ID bukan string:", user);
            return false;
          }
          if (!isValidUuid(user.id)) {
            console.error("User dengan ID bukan UUID ditemukan:", user.id, user);
            return false;
          }
          // Pastikan field lain sesuai tipe
          if (typeof user.username !== "string" || !["admin", "cashier"].includes(user.role) || typeof user.active !== "boolean") {
            console.error("User dengan struktur data tidak valid:", user);
            return false;
          }
          return true;
        });

        users = validatedUsers;
      }
    } else {
      console.error("Failed to fetch users:", await res.text());
    }
  } catch (err) {
    console.error("Fetch users error:", err);
  }

  return <UserManagementClient currentUser={session.user} initialUsers={users} />;
}
