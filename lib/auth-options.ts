// lib/auth-options.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRole } from "@/types/next-auth";

export const authOptions: NextAuthOptions = {
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
          // ✅ Sesuaikan dengan URL backend Anda
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

          if (res.ok && data.success === true) {
            const rawRole = data.user.role;
            if (rawRole !== "cashier" && rawRole !== "admin") {
              console.error("[NEXTAUTH][AUTHORIZE] Invalid role received:", rawRole);
              return null;
            }

            return {
              id: data.user.id,
              username: data.user.username,
              role: rawRole,
              name: data.user.username,
              email: "",
              backendToken: data.accessToken ?? null,
              backendRefreshToken: data.refreshToken ?? null,
            };
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
        // Type assertion untuk user agar sesuai dengan tipe yang didefinisikan
        const typedUser = user as any;
        token.id = typedUser.id;
        token.username = typedUser.username;
        token.role = typedUser.role;
        token.backendToken = typedUser.backendToken ?? null;
        token.backendRefreshToken = typedUser.backendRefreshToken ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as "cashier" | "admin";
        session.user.name = token.username as string;
        session.user.email = "";
        session.user.backendToken = token.backendToken ?? null;
        session.user.backendRefreshToken = token.backendRefreshToken ?? null;
        session.user.isValid = Boolean(token.backendToken);
      }
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
