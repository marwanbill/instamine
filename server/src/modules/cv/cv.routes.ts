import { Router } from "express";
import { getDirectory, getMy, getOne, removeProfile, upsertMyProfile } from "./cv.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { uploadDocument } from "../../middlewares/upload.middleware";

export const cvRouter = Router();

cvRouter.use(requireAuth); // directory is for logged-in students only

cvRouter.get("/", getDirectory);
cvRouter.get("/me", getMy);
cvRouter.post("/me", uploadDocument.single("cv"), upsertMyProfile);
cvRouter.get("/:id", getOne);
cvRouter.delete("/:id", removeProfile);