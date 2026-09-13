import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { authRouter } from "./modules/auth/auth.routes";
import { galleryRouter } from "./modules/gallery/gallery.routes";
import { talentsRouter } from "./modules/talents/talents.routes";
import { notificationRouter } from "./modules/notifications/notification.routes";
import { cvRouter } from "./modules/cv/cv.routes";
import { adminRouter } from "./modules/admin/admin.routes";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/talents", talentsRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/cv", cvRouter);
app.use("/api/admin", adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);