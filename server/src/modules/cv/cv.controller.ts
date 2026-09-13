import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  getAlumniProfile,
  getMyProfile,
  listAlumniProfiles,
  upsertAlumniProfile,
  uploadCvBuffer,
  deleteAlumniProfile,
} from "./cv.service";

const careerEntrySchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
});

const careerEntriesField = z.preprocess((val) => {
  if (typeof val !== "string" || val.trim() === "") return [];
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
}, z.array(careerEntrySchema).max(20));

const upsertSchema = z.object({
  filiere: z.string().min(1),
  promoYear: z.coerce.number().int().min(1950).max(2100),
  currentJobTitle: z.string().min(1),
  currentCompany: z.string().min(1),
  industry: z.string().min(1),
  linkedinUrl: z
    .string()
    .url()
    .refine((val) => val.includes("linkedin.com"), {
      message: "Must be a LinkedIn profile URL",
    }),
  skills: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    ),
  careerEntries: careerEntriesField,
  openToMentoring: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  openToReferrals: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  openToInterviewPrep: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  openToGeneralQuestions: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
});

export async function upsertMyProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = upsertSchema.parse(req.body);

    let cvFileUrl: string | undefined;
    if (req.file) {
      cvFileUrl = await uploadCvBuffer(req.file.buffer);
    }

    const profile = await upsertAlumniProfile(req.user!.id, data, cvFileUrl);
    res.json({ profile });
  } catch (err) {
    next(err);
  }
}

export async function getMy(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await getMyProfile(req.user!.id);
    res.json({ profile });
  } catch (err) {
    next(err);
  }
}

const filtersSchema = z.object({
  filiere: z.string().optional(),
  promoYear: z.coerce.number().optional(),
  industry: z.string().optional(),
  skill: z.string().optional(),
  search: z.string().optional(),
  mentoring: z.coerce.boolean().optional(),
  referrals: z.coerce.boolean().optional(),
  interviewPrep: z.coerce.boolean().optional(),
  generalQuestions: z.coerce.boolean().optional(),
});

export async function getDirectory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const filters = filtersSchema.parse(req.query);
    const profiles = await listAlumniProfiles(filters);
    res.json({ profiles });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await getAlumniProfile(req.params.id);
    res.json({ profile });
  } catch (err) {
    next(err);
  }
}

export async function removeProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await deleteAlumniProfile(
      req.params.id,
      req.user!.id,
      req.user!.role === "ADMIN",
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
