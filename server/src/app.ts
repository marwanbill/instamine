import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { authRouter } from "./modules/auth/auth.routes";
import { galleryRouter } from "./modules/gallery/gallery.routes";
import { talentsRouter } from "./modules/talents/talents.routes";
import { notificationRouter } from "./modules/notifications/notification.routes";
import { cvRouter } from "./modules/cv/cv.routes";
import { adminRouter } from "./modules/admin/admin.routes";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";

export const app = express();

app.set("trust proxy", 1); // needed behind Render/Railway/Vercel's proxy for secure cookies to work

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts — please try again later." },
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many uploads — please slow down." },
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authLimiter, authRouter);
app.use("/api/gallery", uploadLimiter, galleryRouter);
app.use("/api/talents", uploadLimiter, talentsRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/cv", uploadLimiter, cvRouter);
app.use("/api/admin", adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);