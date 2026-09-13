export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: "STUDENT" | "ADMIN";
  isBlocked: boolean;
  blockedAt: string | null;
  createdAt: string;
  _count: {
    galleryPosts: number;
    talentPosts: number;
  };
}