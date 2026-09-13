import { api } from "./axios";
import type { AppNotification } from "../types/notification";

export async function fetchNotifications(): Promise<AppNotification[]> {
  const { data } = await api.get<{ notifications: AppNotification[] }>("/notifications");
  return data.notifications;
}

export async function fetchUnreadCount(): Promise<number> {
  const { data } = await api.get<{ count: number }>("/notifications/unread-count");
  return data.count;
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.post(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.post("/notifications/read-all");
}