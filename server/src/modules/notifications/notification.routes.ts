import { Router } from "express";
import {
  getNotifications,
  getUnreadCount,
  readAllNotifications,
  readNotification,
} from "./notification.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

export const notificationRouter = Router();

notificationRouter.use(requireAuth);
notificationRouter.get("/", getNotifications);
notificationRouter.get("/unread-count", getUnreadCount);
notificationRouter.post("/:id/read", readNotification);
notificationRouter.post("/read-all", readAllNotifications);