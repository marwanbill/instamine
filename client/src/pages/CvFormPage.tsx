import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMyProfile, useUpsertMyProfile } from "../hooks/useCv";
import { SkillsInput } from "../components/cv/SkillsInput";
import { CareerEntriesEditor } from "../components/cv/CareerEntriesEditor";
import { AVAILABILITY_LABELS } from "../types/alumniProfile";
import type { CareerEntryDraft } from "../types/alumniProfile";

const availabilityFields = [
  { key: "openToMentoring" as const, label: AVAILABILITY_LABELS.openToMentoring },
  { key: "openToReferrals" as const, label: AVAILABILITY_LABELS.openToReferrals },
  { key: "openToInterviewPrep" as const, label: AVAILABILITY_LABELS.openToInterviewPrep },
  { key: "openToGeneralQuestions" as const, label: AVAILABILITY_LABELS.openToGeneralQuestions },
];

export function CvFormPage() {
  const navigate = useNavigate();
  const { data: existingProfile, isLoading } = useMyProfile();
  const { mutate, isPending, error } = useUpsertMyProfile();

  const [filiere, setFiliere] = useState("");
  const [promoYear, setPromoYear] = useState("");
  const [currentJobTitle, setCurrentJobTitle] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [careerEntries, setCareerEntries] = useState<CareerEntryDraft[]>([]);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [openToMentoring, setOpenToMentoring] = useState(false);
  const [openToReferrals, setOpenToReferrals] = useState(false);
  const [openToInterviewPrep, setOpenToInterviewPrep] = useState(false);
  const [openToGeneralQuestions, setOpenToGeneralQuestions] = useState(false);

  const availabilityState: Record<string, [boolean, (v: boolean) => void]> = {
    openToMentoring: [openToMentoring, setOpenToMentoring],
    openToReferrals: [openToReferrals, setOpenToReferrals],
    openToInterviewPrep: [openToInterviewPrep, setOpenToInterviewPrep],
    openToGeneralQuestions: [openToGeneralQuestions, setOpenToGeneralQuestions],
  };

  useEffect(() => {
    if (!existingProfile) return;
    setFiliere(existingProfile.filiere);
    setPromoYear(String(existingProfile.promoYear));
    setCurrentJobTitle(existingProfile.currentJobTitle);
    setCurrentCompany(existingProfile.currentCompany);
    setIndustry(existingProfile.industry);
    setLinkedinUrl(existingProfile.linkedinUrl);
    setSkills(existingProfile.skills);
    setOpenToMentoring(existingProfile.openToMentoring);
    setOpenToReferrals(existingProfile.openToReferrals);
    setOpenToInterviewPrep(existingProfile.openToInterviewPrep);
    setOpenToGeneralQuestions(existingProfile.openToGeneralQuestions);
    setCareerEntries(
      existingProfile.careerEntries.map((entry) => ({
        title: entry.title,
        company: entry.company,
        startMonth: entry.startDate.slice(0, 7),
        endMonth: entry.endDate ? entry.endDate.slice(0, 7) : "",
        isCurrent: !entry.endDate,
      }))
    );
  }, [existingProfile]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!filiere.trim() || !promoYear || !currentJobTitle.trim() || !currentCompany.trim() || !industry.trim() || !linkedinUrl.trim()) {
      return;
    }
    if (!existingProfile && !cvFile) return;

    mutate(
      {
        filiere: filiere.trim(),
        promoYear: Number(promoYear),
        currentJobTitle: currentJobTitle.trim(),
        currentCompany: currentCompany.trim(),
        industry: industry.trim(),
        linkedinUrl: linkedinUrl.trim(),
        skills,
        careerEntries,
        cvFile,
        openToMentoring,
        openToReferrals,
        openToInterviewPrep,
        openToGeneralQuestions,
      },
      {
        onSuccess: (profile) => navigate(`/cv/${profile.id}`),
      }
    );
  }

  if (isLoading) {
    return <p className="mx-auto max-w-2xl px-4 py-16 text-sm text-ink/50">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-2xl font-semibold text-blue-deep">
        {existingProfile ? "Edit your profile" : "Add your profile"}
      </h1>
      <p className="mt-1 text-sm text-ink/60">
        Help students in your filière find you and see where your path led.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-ink/70">Filière</label>
            <input
              value={filiere}
              onChange={(e) => setFiliere(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue-mid"
              placeholder="Génie Informatique"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/70">Promo year</label>
            <input
              type="number"
              value={promoYear}
              onChange={(e) => setPromoYear(e.target.value)}
              required
              min={1950}
              max={2100}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue-mid"
              placeholder="2020"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-ink/70">Current job title</label>
            <input
              value={currentJobTitle}
              onChange={(e) => setCurrentJobTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue-mid"
              placeholder="Software Engineer"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/70">Current company</label>
            <input
              value={currentCompany}
              onChange={(e) => setCurrentCompany(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue-mid"
              placeholder="Acme Corp"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-ink/70">Industry</label>
            <input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue-mid"
              placeholder="Fintech"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/70">LinkedIn URL</label>
            <input
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              required
              type="url"
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue-mid"
              placeholder="https://linkedin.com/in/…"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-ink/70">Skills</label>
          <div className="mt-1">
            <SkillsInput value={skills} onChange={setSkills} />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-ink/70">Career path (optional)</label>
          <div className="mt-1">
            <CareerEntriesEditor value={careerEntries} onChange={setCareerEntries} />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-ink/70">
            Let students know how they can reach out
          </label>
          <p className="mt-0.5 text-xs text-ink/40">
            Leave unchecked if you'd rather just be listed without being contacted.
          </p>
          <div className="mt-2 space-y-2">
            {availabilityFields.map(({ key, label }) => {
              const [checked, setChecked] = availabilityState[key];
              return (
                <label key={key} className="flex items-center gap-2 text-sm text-ink/80">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-ink/70">
            {existingProfile ? "Replace CV (PDF)" : "Upload CV (PDF)"}
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
            required={!existingProfile}
            className="mt-1 block w-full text-sm"
          />
          {existingProfile && !cvFile && (
            <p className="mt-1 text-xs text-ink/40">Leave empty to keep your current CV.</p>
          )}
        </div>

        {error && <p className="text-xs text-red-600">Something went wrong — try again.</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-blue-deep py-2.5 text-sm font-medium text-paper disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save profile"}
        </button>
      </form>
    </div>
  );
}