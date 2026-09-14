import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { prisma } from "../../config/db";
import { ApiError } from "../../middlewares/error.middleware";

const oauth2Client = new OAuth2Client({
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  redirectUri: env.GOOGLE_REDIRECT_URI,
});

function adminEmailList(): string[] {
  return env.ADMIN_EMAILS.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function isAdminEmail(email: string): boolean {
  return adminEmailList().includes(email.toLowerCase());
}

export function isAllowedEmail(email: string): boolean {
  return email.toLowerCase().endsWith("@enim.ac.ma") || isAdminEmail(email);
}

export async function exchangeCodeForProfile(code: string) {
  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.id_token) {
    throw new ApiError(401, "Google did not return an ID token");
  }

  const ticket = await oauth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email) {
    throw new ApiError(401, "Could not verify Google account");
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name ?? payload.email,
    avatarUrl: payload.picture ?? null,
  };
}

export async function upsertUserFromGoogle(profile: {
  googleId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}) {
  const existing = await prisma.user.findUnique({ where: { googleId: profile.googleId } });

  if (existing) {
    return prisma.user.update({
      where: { googleId: profile.googleId },
      data: {
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
      },
    });
  }

  return prisma.user.create({
    data: {
      googleId: profile.googleId,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      role: isAdminEmail(profile.email) ? "ADMIN" : "STUDENT",
    },
  });
}

export function issueSessionToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "30d" });
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};