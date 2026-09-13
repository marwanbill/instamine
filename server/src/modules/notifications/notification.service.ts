import { prisma } from "../../config/db";

interface CreateNotificationInput {
  recipientId: string;
  actorId?: string;
  type: "LIKE" | "COMMENT" | "ADMIN_BLOCK";
  postId?: string;
  talentPostId?: string;
  message: string;
}

export async function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({ data: input });
}

export async function listNotifications(userId: string, cursor?: string, take = 20) {
  return prisma.notification.findMany({
    where: { recipientId: userId },
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: "desc" },
    include: {
      actor: { select: { id: true, name: true, avatarUrl: true } },
      post: { select: { id: true, imageUrl: true, title: true } },
      talentPost: { select: { id: true, mediaUrl: true, title: true } },
    },
  });
}

export async function countUnread(userId: string) {
  return prisma.notification.count({ where: { recipientId: userId, isRead: false } });
}

export async function markNotificationRead(notificationId: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id: notificationId, recipientId: userId },
    data: { isRead: true },
  });
}

export async function markAllNotificationsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { recipientId: userId, isRead: false },
    data: { isRead: true },
  });
}