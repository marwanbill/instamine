import { api } from "./axios";
import type { AlumniFilters, AlumniProfile, UpsertProfilePayload } from "../types/alumniProfile";

export async function fetchMyProfile(): Promise<AlumniProfile | null> {
  const { data } = await api.get<{ profile: AlumniProfile | null }>("/cv/me");
  return data.profile;
}

export async function fetchAlumniDirectory(filters: AlumniFilters): Promise<AlumniProfile[]> {
  const cleaned: Record<string, string | number | boolean> = {};
  if (filters.filiere) cleaned.filiere = filters.filiere;
  if (filters.promoYear) cleaned.promoYear = filters.promoYear;
  if (filters.industry) cleaned.industry = filters.industry;
  if (filters.skill) cleaned.skill = filters.skill;
  if (filters.search) cleaned.search = filters.search;
  if (filters.mentoring) cleaned.mentoring = true;
  if (filters.referrals) cleaned.referrals = true;
  if (filters.interviewPrep) cleaned.interviewPrep = true;
  if (filters.generalQuestions) cleaned.generalQuestions = true;

  const { data } = await api.get<{ profiles: AlumniProfile[] }>("/cv", { params: cleaned });
  return data.profiles;
}

export async function fetchAlumniProfile(id: string): Promise<AlumniProfile> {
  const { data } = await api.get<{ profile: AlumniProfile }>(`/cv/${id}`);
  return data.profile;
}

export async function upsertMyProfile(payload: UpsertProfilePayload): Promise<AlumniProfile> {
  const formData = new FormData();
  formData.append("filiere", payload.filiere);
  formData.append("promoYear", String(payload.promoYear));
  formData.append("currentJobTitle", payload.currentJobTitle);
  formData.append("currentCompany", payload.currentCompany);
  formData.append("industry", payload.industry);
  formData.append("linkedinUrl", payload.linkedinUrl);
  formData.append("skills", payload.skills.join(","));
  formData.append("openToMentoring", String(payload.openToMentoring));
  formData.append("openToReferrals", String(payload.openToReferrals));
  formData.append("openToInterviewPrep", String(payload.openToInterviewPrep));
  formData.append("openToGeneralQuestions", String(payload.openToGeneralQuestions));

  const careerEntries = payload.careerEntries.map((entry) => ({
    title: entry.title,
    company: entry.company,
    startDate: `${entry.startMonth}-01`,
    endDate: entry.isCurrent || !entry.endMonth ? undefined : `${entry.endMonth}-01`,
  }));
  formData.append("careerEntries", JSON.stringify(careerEntries));

  if (payload.cvFile) {
    formData.append("cv", payload.cvFile);
  }

  const { data } = await api.post<{ profile: AlumniProfile }>("/cv/me", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.profile;
}

export async function deleteAlumniProfile(id: string): Promise<void> {
  await api.delete(`/cv/${id}`);
}