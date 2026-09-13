import { api } from "./axios";
import type { User } from "../types/user";

export async function exchangeGoogleCode(code: string): Promise<User> {
  const { data } = await api.post<{ user: User }>("/auth/google/callback", { code });
  return data.user;
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const { data } = await api.get<{ user: User }>("/auth/me");
    return data.user;
  } catch {
    return null;
  }
}

export async function logoutRequest(): Promise<void> {
  await api.post("/auth/logout");
}