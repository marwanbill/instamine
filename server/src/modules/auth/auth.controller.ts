import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  exchangeCodeForProfile,
  isAllowedEmail,
  issueSessionToken,
  SESSION_COOKIE_OPTIONS,
  upsertUserFromGoogle,
} from "./auth.service";
import { ApiError } from "../../middlewares/error.middleware";

const callbackSchema = z.object({
  code: z.string().min(1),
});

export async function googleCallback(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { code } = callbackSchema.parse(req.body);

    const profile = await exchangeCodeForProfile(code);

    /* if (!isAllowedEmail(profile.email)) {
      throw new ApiError(
        403,
        "Try to log in with your professional email @enim.ac.ma",
      );
    } */

    const user = await upsertUserFromGoogle(profile);
    const token = issueSessionToken(user.id);

    res.cookie("session", token, SESSION_COOKIE_OPTIONS);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        promo: user.promo,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json({ user: req.user });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("session", { ...SESSION_COOKIE_OPTIONS, maxAge: undefined });
  res.status(204).send();
}
