import { Router } from "express";
import { getCurrentUser, googleCallback, logout } from "./auth.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

export const authRouter = Router();

authRouter.post("/google/callback", googleCallback);
authRouter.get("/me", requireAuth, getCurrentUser);
authRouter.post("/logout", logout);