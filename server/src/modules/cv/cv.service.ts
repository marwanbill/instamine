import streamifier from "streamifier";
import { cloudinary } from "../../config/cloudinary";
import { prisma } from "../../config/db";
import { ApiError } from "../../middlewares/error.middleware";

export function uploadCvBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "instamine/cv",
        resource_type: "raw",
        public_id: `cv-${Date.now()}`,
        format: "pdf",
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

const profileInclude = {
  user: { select: { id: true, name: true, avatarUrl: true, isBlocked: true } },
  careerEntries: { orderBy: { startDate: "desc" as const } },
};

export async function getMyProfile(userId: string) {
  return prisma.alumniProfile.findUnique({
    where: { userId },
    include: profileInclude,
  });
}

export async function getAlumniProfile(id: string) {
  const profile = await prisma.alumniProfile.findUnique({
    where: { id },
    include: profileInclude,
  });
  if (!profile) throw new ApiError(404, "Profile not found");
  return profile;
}

interface DirectoryFilters {
  filiere?: string;
  promoYear?: number;
  industry?: string;
  skill?: string;
  search?: string;
  mentoring?: boolean;
  referrals?: boolean;
  interviewPrep?: boolean;
  generalQuestions?: boolean;
}

export async function listAlumniProfiles(filters: DirectoryFilters) {
  return prisma.alumniProfile.findMany({
    where: {
      ...(filters.filiere
        ? { filiere: { equals: filters.filiere, mode: "insensitive" } }
        : {}),
      ...(filters.promoYear ? { promoYear: filters.promoYear } : {}),
      ...(filters.industry
        ? { industry: { equals: filters.industry, mode: "insensitive" } }
        : {}),
      ...(filters.skill ? { skills: { has: filters.skill } } : {}),
      ...(filters.mentoring ? { openToMentoring: true } : {}),
      ...(filters.referrals ? { openToReferrals: true } : {}),
      ...(filters.interviewPrep ? { openToInterviewPrep: true } : {}),
      ...(filters.generalQuestions ? { openToGeneralQuestions: true } : {}),
      ...(filters.search
        ? {
            OR: [
              {
                currentJobTitle: {
                  contains: filters.search,
                  mode: "insensitive",
                },
              },
              {
                currentCompany: {
                  contains: filters.search,
                  mode: "insensitive",
                },
              },
              {
                user: {
                  name: { contains: filters.search, mode: "insensitive" },
                },
              },
            ],
          }
        : {}),
    },
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

interface CareerEntryInput {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
}

interface UpsertProfileInput {
  filiere: string;
  promoYear: number;
  currentJobTitle: string;
  currentCompany: string;
  industry: string;
  linkedinUrl: string;
  skills: string[];
  careerEntries: CareerEntryInput[];
  openToMentoring: boolean;
  openToReferrals: boolean;
  openToInterviewPrep: boolean;
  openToGeneralQuestions: boolean;
}

export async function upsertAlumniProfile(
  userId: string,
  data: UpsertProfileInput,
  cvFileUrl?: string
) {
  const existing = await prisma.alumniProfile.findUnique({ where: { userId } });

  if (!existing && !cvFileUrl) {
    throw new ApiError(400, "A CV file is required");
  }

  let profile;

  if (existing) {
    profile = await prisma.alumniProfile.update({
      where: { userId },
      data: {
        filiere: data.filiere,
        promoYear: data.promoYear,
        currentJobTitle: data.currentJobTitle,
        currentCompany: data.currentCompany,
        industry: data.industry,
        linkedinUrl: data.linkedinUrl,
        skills: data.skills,
        openToMentoring: data.openToMentoring,
        openToReferrals: data.openToReferrals,
        openToInterviewPrep: data.openToInterviewPrep,
        openToGeneralQuestions: data.openToGeneralQuestions,
        ...(cvFileUrl ? { cvFileUrl } : {}),
      },
    });
  } else {
    profile = await prisma.alumniProfile.create({
      data: {
        userId,
        filiere: data.filiere,
        promoYear: data.promoYear,
        currentJobTitle: data.currentJobTitle,
        currentCompany: data.currentCompany,
        industry: data.industry,
        linkedinUrl: data.linkedinUrl,
        skills: data.skills,
        cvFileUrl: cvFileUrl!, // safe here — checked above when !existing
        openToMentoring: data.openToMentoring,
        openToReferrals: data.openToReferrals,
        openToInterviewPrep: data.openToInterviewPrep,
        openToGeneralQuestions: data.openToGeneralQuestions,
      },
    });
  }

  await prisma.careerEntry.deleteMany({ where: { profileId: profile.id } });

  const validEntries = data.careerEntries.filter((entry) => {
    const start = new Date(entry.startDate);
    if (isNaN(start.getTime())) return false;
    if (entry.endDate) {
      const end = new Date(entry.endDate);
      if (isNaN(end.getTime())) return false;
    }
    return true;
  });

  if (validEntries.length > 0) {
    await prisma.careerEntry.createMany({
      data: validEntries.map((entry, index) => ({
        profileId: profile.id,
        title: entry.title,
        company: entry.company,
        startDate: new Date(entry.startDate),
        endDate: entry.endDate ? new Date(entry.endDate) : null,
        order: index,
      })),
    });
  }

  return getAlumniProfile(profile.id);
}

export async function deleteAlumniProfile(
  profileId: string,
  requesterId: string,
  isAdmin: boolean,
) {
  const profile = await prisma.alumniProfile.findUnique({
    where: { id: profileId },
  });
  if (!profile) throw new ApiError(404, "Profile not found");
  if (profile.userId !== requesterId && !isAdmin) {
    throw new ApiError(403, "You can only delete your own profile");
  }

  await prisma.alumniProfile.delete({ where: { id: profileId } });
}
