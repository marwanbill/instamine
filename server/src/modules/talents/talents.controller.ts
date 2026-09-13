import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { TalentCategory } from "@prisma/client";
import {
  createTalentComment,
  createTalentPost,
  deleteTalentComment,
  deleteTalentPost,
  getTalentPostDetail,
  listTalentComments,
  listTalentLikers,
  listTalentPosts,
  toggleTalentLike,
  updateTalentComment,
  updateTalentPost,
  uploadImageBuffer,
} from "./talents.service";
import { ApiError } from "../../middlewares/error.middleware";

const createSchema = z.object({
  title: z.string().min(1).max(120),
  content: z.string().min(1).max(2000),
  category: z.nativeEnum(TalentCategory),
});

export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw new ApiError(400, "A picture is required");
    const { title, content, category } = createSchema.parse(req.body);

    const mediaUrl = await uploadImageBuffer(req.file.buffer);
    const post = await createTalentPost(req.user!.id, title, content, category, mediaUrl);

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

    const posts = await listTalentPosts(!!req.user, sort, cursor);
    res.json({ posts, isPreview: !req.user });
  } catch (err) {
    next(err);
  }
}

export async function getPostDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const post = await getTalentPostDetail(req.params.id, req.user?.id);
    res.json({ post });
  } catch (err) {
    next(err);
  }
}

const updateSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  content: z.string().min(1).max(2000).optional(),
  category: z.nativeEnum(TalentCategory).optional(),
});

export async function updatePost(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateSchema.parse(req.body);
    const post = await updateTalentPost(req.params.id, req.user!.id, data);
    res.json({ post });
  } catch (err) {
    next(err);
  }
}

export async function removePost(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteTalentPost(req.params.id, req.user!.id, req.user!.role === "ADMIN");
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function likePost(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await toggleTalentLike(req.params.id, req.user!.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getLikers(req: Request, res: Response, next: NextFunction) {
  try {
    const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    const likers = await listTalentLikers(req.params.id, cursor);
    res.json({ likers });
  } catch (err) {
    next(err);
  }
}

export async function getComments(req: Request, res: Response, next: NextFunction) {
  try {
    const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    const comments = await listTalentComments(req.params.id, cursor);
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
    const comment = await createTalentComment(req.params.id, req.user!.id, content);
    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
}

export async function editComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { content } = commentSchema.parse(req.body);
    const comment = await updateTalentComment(req.params.commentId, req.user!.id, content);
    res.json({ comment });
  } catch (err) {
    next(err);
  }
}

export async function removeComment(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteTalentComment(req.params.commentId, req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}