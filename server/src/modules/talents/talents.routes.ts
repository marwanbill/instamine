import { Router } from "express";
import {
  createPost,
  editComment,
  getComments,
  getLikers,
  getPostDetail,
  getPosts,
  likePost,
  postComment,
  removeComment,
  removePost,
  updatePost,
} from "./talents.controller";
import {
  attachUserIfPresent,
  requireAuth,
  requireNotBlocked,
} from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";

export const talentsRouter = Router();

talentsRouter.get("/", attachUserIfPresent, getPosts);
talentsRouter.post("/", requireAuth, requireNotBlocked, upload.single("image"), createPost);

talentsRouter.get("/:id", attachUserIfPresent, getPostDetail);
talentsRouter.patch("/:id", requireAuth, updatePost);
talentsRouter.delete("/:id", requireAuth, removePost);

talentsRouter.post("/:id/like", requireAuth, likePost);
talentsRouter.get("/:id/likes", attachUserIfPresent, getLikers);

talentsRouter.get("/:id/comments", attachUserIfPresent, getComments);
talentsRouter.post("/:id/comments", requireAuth, postComment);
talentsRouter.patch("/:id/comments/:commentId", requireAuth, editComment);
talentsRouter.delete("/:id/comments/:commentId", requireAuth, removeComment);