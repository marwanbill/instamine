import streamifier from "streamifier";
import { cloudinary } from "../../config/cloudinary";
import { prisma } from "../../config/db";
import { ApiError } from "../../middlewares/error.middleware";
import { createNotification } from "../notifications/notification.service";

export function uploadImageBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "instamine/gallery" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export async function createGalleryPost(
  authorId: string,
  imageUrl: string,
  title: string,
  caption?: string
) {
  return prisma.galleryPost.create({
    data: { authorId, imageUrl, title, caption },
    include: { author: { select: { id: true, name: true, avatarUrl: true } } },
  });
}

export async function listGalleryPosts(
  isAuthenticated: boolean,
  sort: "recent" | "popular" = "recent",
  cursor?: string
) {
  const take = isAuthenticated ? 12 : 3;

  return prisma.galleryPost.findMany({
    take,
    ...(cursor && isAuthenticated ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: sort === "popular" ? { likesCount: "desc" } : { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
    },
  });
}

export async function getGalleryPostDetail(postId: string, viewerId?: string) {
  const post = await prisma.galleryPost.findUnique({
    where: { id: postId },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true, isBlocked: true } },
    },
  });

  if (!post) throw new ApiError(404, "Post not found");

  let isLikedByMe = false;
  if (viewerId) {
    const like = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId: viewerId } },
    });
    isLikedByMe = !!like;
  }

  return { ...post, isLikedByMe };
}

export async function updateGalleryPost(
  postId: string,
  requesterId: string,
  data: { title?: string; caption?: string }
) {
  const post = await prisma.galleryPost.findUnique({ where: { id: postId } });
  if (!post) throw new ApiError(404, "Post not found");
  if (post.authorId !== requesterId) throw new ApiError(403, "You can only edit your own posts");

  return prisma.galleryPost.update({
    where: { id: postId },
    data,
    include: { author: { select: { id: true, name: true, avatarUrl: true } } },
  });
}

export async function deleteGalleryPost(postId: string, requesterId: string, isAdmin: boolean) {
  const post = await prisma.galleryPost.findUnique({ where: { id: postId } });
  if (!post) throw new ApiError(404, "Post not found");
  if (post.authorId !== requesterId && !isAdmin) {
    throw new ApiError(403, "You can only delete your own posts");
  }

  await prisma.galleryPost.delete({ where: { id: postId } });
}

export async function toggleLike(postId: string, userId: string) {
  const post = await prisma.galleryPost.findUnique({ where: { id: postId } });
  if (!post) throw new ApiError(404, "Post not found");

  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existing) {
    const [, updatedPost] = await prisma.$transaction([
      prisma.like.delete({ where: { id: existing.id } }),
      prisma.galleryPost.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      }),
    ]);
    return { liked: false, likesCount: updatedPost.likesCount };
  }

  const [, updatedPost] = await prisma.$transaction([
    prisma.like.create({ data: { postId, userId } }),
    prisma.galleryPost.update({
      where: { id: postId },
      data: { likesCount: { increment: 1 } },
    }),
  ]);

  if (post.authorId !== userId) {
    const actor = await prisma.user.findUnique({ where: { id: userId } });
    if (actor) {
      await createNotification({
        recipientId: post.authorId,
        actorId: userId,
        type: "LIKE",
        postId,
        message: `${actor.name} liked your post "${post.title}"`,
      });
    }
  }

  return { liked: true, likesCount: updatedPost.likesCount };
}

export async function listLikers(postId: string, cursor?: string, take = 20) {
  const likes = await prisma.like.findMany({
    where: { postId },
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
  });

  return likes.map((like) => like.user);
}

export async function listComments(postId: string, cursor?: string, take = 20) {
  return prisma.comment.findMany({
    where: { postId },
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: "desc" },
    include: { author: { select: { id: true, name: true, avatarUrl: true } } },
  });
}

export async function createComment(postId: string, authorId: string, content: string) {
  const post = await prisma.galleryPost.findUnique({ where: { id: postId } });
  if (!post) throw new ApiError(404, "Post not found");

  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: { postId, authorId, content },
      include: { author: { select: { id: true, name: true, avatarUrl: true } } },
    }),
    prisma.galleryPost.update({
      where: { id: postId },
      data: { commentsCount: { increment: 1 } },
    }),
  ]);

  if (post.authorId !== authorId) {
    await createNotification({
      recipientId: post.authorId,
      actorId: authorId,
      type: "COMMENT",
      postId,
      message: `${comment.author.name} commented on your post "${post.title}"`,
    });
  }

  return comment;
}

export async function updateComment(commentId: string, requesterId: string, content: string) {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw new ApiError(404, "Comment not found");
  if (comment.authorId !== requesterId) throw new ApiError(403, "You can only edit your own comments");

  return prisma.comment.update({
    where: { id: commentId },
    data: { content },
    include: { author: { select: { id: true, name: true, avatarUrl: true } } },
  });
}

export async function deleteComment(commentId: string, requesterId: string) {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw new ApiError(404, "Comment not found");
  if (comment.authorId !== requesterId) throw new ApiError(403, "You can only delete your own comments");

  await prisma.$transaction([
    prisma.comment.delete({ where: { id: commentId } }),
    prisma.galleryPost.update({
      where: { id: comment.postId },
      data: { commentsCount: { decrement: 1 } },
    }),
  ]);
}