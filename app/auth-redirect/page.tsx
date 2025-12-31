// app/auth-redirect/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export default async function AuthRedirect() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {
    return redirect("/login");
  }

  // ✅ Arahkan berdasarkan role
  if (session.user.role === "admin") {
    return redirect("/admin");
  }
  return redirect("/"); // untuk cashier
}
