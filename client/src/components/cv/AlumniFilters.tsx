import { AVAILABILITY_LABELS } from "../../types/alumniProfile";
import type { AlumniFilters } from "../../types/alumniProfile";

interface AlumniFiltersProps {
  filters: AlumniFilters;
  onChange: (filters: AlumniFilters) => void;
}

const availabilityKeys: { key: keyof AlumniFilters; label: string }[] = [
  { key: "mentoring", label: AVAILABILITY_LABELS.openToMentoring },
  { key: "referrals", label: AVAILABILITY_LABELS.openToReferrals },
  { key: "interviewPrep", label: AVAILABILITY_LABELS.openToInterviewPrep },
  { key: "generalQuestions", label: AVAILABILITY_LABELS.openToGeneralQuestions },
];

export function AlumniFiltersBar({ filters, onChange }: AlumniFiltersProps) {
  function update(patch: Partial<AlumniFilters>) {
    onChange({ ...filters, ...patch });
  }

  function toggleAvailability(key: keyof AlumniFilters) {
    update({ [key]: filters[key] ? undefined : true } as Partial<AlumniFilters>);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <input
          value={filters.search ?? ""}
          onChange={(e) => update({ search: e.target.value || undefined })}
          placeholder="Search by name or company…"
          className="min-w-[200px] flex-1 rounded-full border border-line px-4 py-2 text-sm outline-none focus:border-blue-mid"
        />
        <input
          value={filters.filiere ?? ""}
          onChange={(e) => update({ filiere: e.target.value || undefined })}
          placeholder="Filière"
          className="w-36 rounded-full border border-line px-4 py-2 text-sm outline-none focus:border-blue-mid"
        />
        <input
          type="number"
          value={filters.promoYear ?? ""}
          onChange={(e) => update({ promoYear: e.target.value ? Number(e.target.value) : undefined })}
          placeholder="Promo year"
          className="w-32 rounded-full border border-line px-4 py-2 text-sm outline-none focus:border-blue-mid"
        />
        <input
          value={filters.industry ?? ""}
          onChange={(e) => update({ industry: e.target.value || undefined })}
          placeholder="Industry"
          className="w-36 rounded-full border border-line px-4 py-2 text-sm outline-none focus:border-blue-mid"
        />
        <input
          value={filters.skill ?? ""}
          onChange={(e) => update({ skill: e.target.value || undefined })}
          placeholder="Skill"
          className="w-32 rounded-full border border-line px-4 py-2 text-sm outline-none focus:border-blue-mid"
        />

        {Object.values(filters).some(Boolean) && (
          <button
            onClick={() => onChange({})}
            className="rounded-full border border-line px-4 py-2 text-sm text-ink/60 hover:bg-ink/5"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {availabilityKeys.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => toggleAvailability(key)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              filters[key]
                ? "border-blue-deep bg-blue-deep/10 text-blue-deep"
                : "border-line text-ink/60 hover:bg-ink/5"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}