import { api } from "./axios";
import type { AdminUser } from "../types/adminUser";

export async function fetchAdminUsers(search?: string): Promise<AdminUser[]> {
  const { data } = await api.get<{ users: AdminUser[] }>("/admin/users", {
    params: search ? { search } : undefined,
  });
  return data.users;
}

export async function blockUser(userId: string): Promise<void> {
  await api.post(`/admin/users/${userId}/block`);
}

export async function unblockUser(userId: string): Promise<void> {
  await api.post(`/admin/users/${userId}/unblock`);
}