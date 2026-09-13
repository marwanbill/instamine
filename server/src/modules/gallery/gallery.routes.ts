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
} from "./gallery.controller";
import {
  attachUserIfPresent,
  requireAuth,
  requireNotBlocked,
} from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";

export const galleryRouter = Router();

galleryRouter.get("/", attachUserIfPresent, getPosts);
galleryRouter.post("/", requireAuth, requireNotBlocked, upload.single("image"), createPost);

galleryRouter.get("/:id", attachUserIfPresent, getPostDetail);
galleryRouter.patch("/:id", requireAuth, updatePost);
galleryRouter.delete("/:id", requireAuth, removePost);

galleryRouter.post("/:id/like", requireAuth, likePost);
galleryRouter.get("/:id/likes", attachUserIfPresent, getLikers);

galleryRouter.get("/:id/comments", attachUserIfPresent, getComments);
galleryRouter.post("/:id/comments", requireAuth, postComment);
galleryRouter.patch("/:id/comments/:commentId", requireAuth, editComment);
galleryRouter.delete("/:id/comments/:commentId", requireAuth, removeComment);