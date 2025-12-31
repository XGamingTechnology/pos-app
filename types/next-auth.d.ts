// types/next-auth.d.ts
import "next-auth";
import NextAuth, { DefaultSession } from "next-auth";

// UserRole type is now in next-auth.ts
import { UserRole } from "./next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      username: string;
      role: UserRole;
      name: string;
      email: string;
      backendToken: string | null;
      backendRefreshToken: string | null;
      isValid: boolean;
    } & DefaultSession["user"];
    expires: string;
  }

  interface User {
    id: string;
    username: string;
    role: UserRole;
    name: string;
    email?: string;
    backendToken?: string | null;
    backendRefreshToken?: string | null;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `token` argument in the `session` callback */
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
