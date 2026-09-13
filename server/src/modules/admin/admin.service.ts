import { prisma } from "../../config/db";
import { ApiError } from "../../middlewares/error.middleware";
import { createNotification } from "../notifications/notification.service";

export async function blockUser(userId: string, adminId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");
  if (user.role === "ADMIN") throw new ApiError(400, "Cannot block an admin");

  await prisma.user.update({
    where: { id: userId },
    data: { isBlocked: true, blockedAt: new Date() },
  });

  await createNotification({
    recipientId: userId,
    actorId: adminId,
    type: "ADMIN_BLOCK",
    message: "Your account has been blocked from posting by an admin.",
  });
}

export async function unblockUser(userId: string, adminId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");

  await prisma.user.update({
    where: { id: userId },
    data: { isBlocked: false, blockedAt: null },
  });

  await createNotification({
    recipientId: userId,
    actorId: adminId,
    type: "ADMIN_BLOCK",
    message: "Your account has been unblocked — you can post again.",
  });
}

export async function listUsers(search?: string) {
  return prisma.user.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      role: true,
      isBlocked: true,
      blockedAt: true,
      createdAt: true,
      _count: {
        select: { galleryPosts: true, talentPosts: true },
      },
    },
  });
}