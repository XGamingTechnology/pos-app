// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { UserRole } from "@/types/next-auth.d.ts"; // ✅ Impor tipe dari file global

// Tipe internal untuk authorize()
interface MyUser {
  id: string;
  username: string;
  role: UserRole; // ✅ Gunakan UserRole, bukan string
  name: string;
  email: string;
  backendToken?: string | null;
  backendRefreshToken?: string | null;
}

// ❌ JANGAN definisi ulang module "next-auth" di sini!
// Karena sudah didefinisikan di types/next-auth.d.ts

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[NEXTAUTH][AUTHORIZE] Received credentials:", { username: credentials?.username });

        if (!credentials?.username || !credentials?.password) {
          console.warn("[NEXTAUTH][AUTHORIZE] Missing username or password");
          return null;
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          const text = await res.text();
          let data: any;
          try {
            data = JSON.parse(text);
          } catch (err) {
            console.error("[NEXTAUTH][AUTHORIZE] Backend returned invalid JSON:", text);
            return null;
          }

          console.log("[NEXTAUTH][AUTHORIZE] Backend response:", data);

          if (res.ok && data.success === true) {
            // ✅ Pastikan role valid dengan type assertion
            const rawRole = data.user.role;
            if (rawRole !== "cashier" && rawRole !== "admin") {
              console.error("[NEXTAUTH][AUTHORIZE] Invalid role received:", rawRole);
              return null;
            }

            const user: MyUser = {
              id: data.user.id,
              username: data.user.username,
              role: rawRole, // ✅ Sekarang pasti UserRole
              name: data.user.username,
              email: "",
              backendToken: data.accessToken ?? null,
              backendRefreshToken: data.refreshToken ?? null,
            };

            console.log("[NEXTAUTH][AUTHORIZE] ✅ User authorized successfully");
            return user;
          } else {
            console.warn("[NEXTAUTH][AUTHORIZE] ❌ Backend login failed:", data.message || data);
            return null;
          }
        } catch (err: any) {
          console.error("[NEXTAUTH][AUTHORIZE] 🌐 Network error:", err.message || err);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 jam
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as MyUser;
        token.id = u.id;
        token.username = u.username;
        token.role = u.role; // ✅ UserRole
        token.backendToken = u.backendToken ?? null;
        token.backendRefreshToken = u.backendRefreshToken ?? null;
        console.log("[NEXTAUTH][JWT] Token updated with user data");
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.role = token.role as UserRole; // ✅ Pastikan tipe UserRole
      session.user.name = token.username as string;
      session.user.email = "";
      session.user.backendToken = token.backendToken ?? null;
      session.user.backendRefreshToken = token.backendRefreshToken ?? null;
      session.user.isValid = Boolean(token.backendToken);

      console.log("[NEXTAUTH][SESSION] Session built successfully");
      return session;
    },

    async redirect({ url, baseUrl }) {
      return `${baseUrl}/auth-redirect`;
    },
  },

  pages: {
    signIn: "/login",
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
