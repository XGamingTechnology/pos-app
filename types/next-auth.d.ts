// types/next-auth.d.ts
import "next-auth";

// UserRole type is now in next-auth.ts
import { UserRole } from "./next-auth";

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
      role: UserRole;
      name: string;
      email: string;
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
