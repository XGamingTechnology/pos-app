// app/api/auth/[...nextauth]/route.ts
import { authOptions } from "@/lib/auth-options"; // ✅ Ambil dari lib
import NextAuth from "next-auth";

// ❌ HAPUS SEMUA KODE DI DALAM export const authOptions = { ... }

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; // ✅ Hanya ini yang boleh diekspor
