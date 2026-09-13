import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { blockUser, listUsers, unblockUser } from "./admin.service";

export async function block(req: Request, res: Response, next: NextFunction) {
  try {
    await blockUser(req.params.userId, req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function unblock(req: Request, res: Response, next: NextFunction) {
  try {
    await unblockUser(req.params.userId, req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

const listUsersSchema = z.object({
  search: z.string().optional(),
});

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { search } = listUsersSchema.parse(req.query);
    const users = await listUsers(search);
    res.json({ users });
  } catch (err) {
    next(err);
  }
}