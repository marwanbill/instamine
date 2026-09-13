import { Router } from "express";
import { block, getUsers, unblock } from "./admin.controller";
import { requireAdmin, requireAuth } from "../../middlewares/auth.middleware";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);
adminRouter.get("/users", getUsers);
adminRouter.post("/users/:userId/block", block);
adminRouter.post("/users/:userId/unblock", unblock);