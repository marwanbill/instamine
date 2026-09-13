import type { CareerEntry } from "../../types/alumniProfile";

interface CareerTimelineProps {
  entries: CareerEntry[];
}

function formatMonthYear(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

export function CareerTimeline({ entries }: CareerTimelineProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-ink/50">No career history added yet.</p>;
  }

  return (
    <ol className="space-y-4 border-l-2 border-line pl-4">
      {entries.map((entry) => (
        <li key={entry.id} className="relative">
          <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-deep" />
          <p className="text-sm font-semibold text-ink">{entry.title}</p>
          <p className="text-sm text-ink/60">{entry.company}</p>
          <p className="text-xs text-ink/40">
            {formatMonthYear(entry.startDate)} — {entry.endDate ? formatMonthYear(entry.endDate) : "Present"}
          </p>
        </li>
      ))}
    </ol>
  );
}