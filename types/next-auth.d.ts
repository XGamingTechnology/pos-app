import { DefaultSession } from "next-auth";
import "next-auth/jwt";

type UserRole = "admin" | "cashier";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: UserRole;
      backendToken: string | null;
      backendRefreshToken: string | null;
      isValid: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    role: UserRole;
    backendToken?: string | null;
    backendRefreshToken?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    role?: UserRole;
    backendToken?: string | null;
    backendRefreshToken?: string | null;
  }
}
