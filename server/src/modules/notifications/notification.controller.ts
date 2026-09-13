import { Request, Response, NextFunction } from "express";
import {
  countUnread,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "./notification.service";

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    const notifications = await listNotifications(req.user!.id, cursor);
    res.json({ notifications });
  } catch (err) {
    next(err);
  }
}

export async function getUnreadCount(req: Request, res: Response, next: NextFunction) {
  try {
    const count = await countUnread(req.user!.id);
    res.json({ count });
  } catch (err) {
    next(err);
  }
}

export async function readNotification(req: Request, res: Response, next: NextFunction) {
  try {
    await markNotificationRead(req.params.id, req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function readAllNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    await markAllNotificationsRead(req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}