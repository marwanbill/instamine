import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  createComment,
  createGalleryPost,
  deleteComment,
  deleteGalleryPost,
  getGalleryPostDetail,
  listComments,
  listGalleryPosts,
  listLikers,
  toggleLike,
  updateComment,
  updateGalleryPost,
  uploadImageBuffer,
} from "./gallery.service";
import { ApiError } from "../../middlewares/error.middleware";

const createSchema = z.object({
  title: z.string().min(1).max(120),
  caption: z.string().max(280).optional(),
});

export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw new ApiError(400, "An image file is required");
    const { title, caption } = createSchema.parse(req.body);

    const imageUrl = await uploadImageBuffer(req.file.buffer);
    const post = await createGalleryPost(req.user!.id, imageUrl, title, caption);

    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
}

const sortSchema = z.enum(["recent", "popular"]);

export async function getPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    const sortResult = sortSchema.safeParse(req.query.sort);
    const sort = sortResult.success ? sortResult.data : "recent";

    const posts = await listGalleryPosts(!!req.user, sort, cursor);
    res.json({ posts, isPreview: !req.user });
  } catch (err) {
    next(err);
  }
}

export async function getPostDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const post = await getGalleryPostDetail(req.params.id, req.user?.id);
    res.json({ post });
  } catch (err) {
    next(err);
  }
}

const updateSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  caption: z.string().max(280).optional(),
});

export async function updatePost(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateSchema.parse(req.body);
    const post = await updateGalleryPost(req.params.id, req.user!.id, data);
    res.json({ post });
  } catch (err) {
    next(err);
  }
}

export async function removePost(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteGalleryPost(req.params.id, req.user!.id, req.user!.role === "ADMIN");
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function likePost(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await toggleLike(req.params.id, req.user!.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getLikers(req: Request, res: Response, next: NextFunction) {
  try {
    const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    const likers = await listLikers(req.params.id, cursor);
    res.json({ likers });
  } catch (err) {
    next(err);
  }
}

export async function getComments(req: Request, res: Response, next: NextFunction) {
  try {
    const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    const comments = await listComments(req.params.id, cursor);
    res.json({ comments });
  } catch (err) {
    next(err);
  }
}

const commentSchema = z.object({
  content: z.string().min(1).max(500),
});

export async function postComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { content } = commentSchema.parse(req.body);
    const comment = await createComment(req.params.id, req.user!.id, content);
    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
}

const updateCommentSchema = z.object({
  content: z.string().min(1).max(500),
});

export async function editComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { content } = updateCommentSchema.parse(req.body);
    const comment = await updateComment(req.params.commentId, req.user!.id, content);
    res.json({ comment });
  } catch (err) {
    next(err);
  }
}

export async function removeComment(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteComment(req.params.commentId, req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}