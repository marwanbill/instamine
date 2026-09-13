export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  promo: string | null;
  role: "STUDENT" | "ADMIN";
  isBlocked: boolean;
}