export interface AppNotification {
  id: string;
  type: "LIKE" | "COMMENT" | "ADMIN_BLOCK";
  message: string;
  isRead: boolean;
  createdAt: string;
  actor: { id: string; name: string; avatarUrl: string | null } | null;
  post: { id: string; imageUrl: string; title: string } | null;
}