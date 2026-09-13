export interface AlumniAuthor {
  id: string;
  name: string;
  avatarUrl: string | null;
  isBlocked?: boolean;
}

export interface CareerEntry {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
}

export interface AlumniProfile {
  id: string;
  filiere: string;
  promoYear: number;
  currentJobTitle: string;
  currentCompany: string;
  industry: string;
  linkedinUrl: string;
  cvFileUrl: string;
  skills: string[];
  openToMentoring: boolean;
  openToReferrals: boolean;
  openToInterviewPrep: boolean;
  openToGeneralQuestions: boolean;
  createdAt: string;
  updatedAt: string;
  user: AlumniAuthor;
  careerEntries: CareerEntry[];
}

export interface AlumniFilters {
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

export interface CareerEntryDraft {
  title: string;
  company: string;
  startMonth: string;
  endMonth: string;
  isCurrent: boolean;
}

export interface UpsertProfilePayload {
  filiere: string;
  promoYear: number;
  currentJobTitle: string;
  currentCompany: string;
  industry: string;
  linkedinUrl: string;
  skills: string[];
  careerEntries: CareerEntryDraft[];
  cvFile?: File | null;
  openToMentoring: boolean;
  openToReferrals: boolean;
  openToInterviewPrep: boolean;
  openToGeneralQuestions: boolean;
}

export const AVAILABILITY_LABELS = {
  openToMentoring: "Mentoring",
  openToReferrals: "Internship/job referrals",
  openToInterviewPrep: "Interview prep",
  openToGeneralQuestions: "General questions",
} as const;