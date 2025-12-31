// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

// Definisikan UserRole secara langsung di sini — jangan import!
type UserRole = "admin" | "cashier";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    role: UserRole;
    name: string;
    email?: string;
    backendToken?: string | null;
    backendRefreshToken?: string | null;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      name: string;
      email: string;
      role: UserRole;
      backendToken: string | null;
      backendRefreshToken: string | null;
      isValid: boolean;
    };
    expires: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    role?: UserRole;
    name?: string;
    email?: string;
    backendToken?: string | null;
    backendRefreshToken?: string | null;
  }
}
