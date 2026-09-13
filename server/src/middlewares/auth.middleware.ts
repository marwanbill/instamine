import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../config/db";

interface SessionPayload {
  userId: string;
}

function toAuthenticatedUser(user: {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  promo: string | null;
  role: "STUDENT" | "ADMIN";
  isBlocked: boolean;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    promo: user.promo,
    role: user.role,
    isBlocked: user.isBlocked,
  };
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.session;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as SessionPayload;
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    req.user = toAuthenticatedUser(user);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}

export async function attachUserIfPresent(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.session;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as SessionPayload;
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (user) {
      req.user = toAuthenticatedUser(user);
    }
  } catch {
    // invalid token — just proceed unauthenticated
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

export function requireNotBlocked(req: Request, res: Response, next: NextFunction) {
  if (req.user?.isBlocked) {
    return res.status(403).json({ error: "You're blocked." });
  }
  next();
}