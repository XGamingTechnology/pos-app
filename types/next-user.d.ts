interface MyUser {
  id: string;
  username: string;
  role: string;
  name: string;
  email?: string; // opsional, boleh undefined
  backendToken?: string | null; // <-- penting: bisa null!
  backendRefreshToken?: string | null;
}
