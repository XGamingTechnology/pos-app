// types/next-auth.ts
export type UserRole = "cashier" | "admin";

// Tambahkan interface lain yang mungkin dibutuhkan
export interface UserType {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  email?: string;
  backendToken?: string | null;
  backendRefreshToken?: string | null;
}

export interface SessionType {
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

export interface JWTType {
  id?: string;
  username?: string;
  role?: UserRole;
  name?: string;
  email?: string;
  backendToken?: string | null;
  backendRefreshToken?: string | null;
}