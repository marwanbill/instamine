import type { AlumniProfile } from "../../types/alumniProfile";
import { AVAILABILITY_LABELS } from "../../types/alumniProfile";

interface AvailabilityBadgesProps {
  profile: Pick<AlumniProfile, "openToMentoring" | "openToReferrals" | "openToInterviewPrep" | "openToGeneralQuestions">;
  size?: "sm" | "md";
}

export function AvailabilityBadges({ profile, size = "sm" }: AvailabilityBadgesProps) {
  const active = (Object.keys(AVAILABILITY_LABELS) as (keyof typeof AVAILABILITY_LABELS)[]).filter(
    (key) => profile[key]
  );

  if (active.length === 0) return null;

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <div className="flex flex-wrap gap-1.5">
      {active.map((key) => (
        <span
          key={key}
          className={`rounded-full bg-blue-mid/15 font-medium text-blue-mid ${sizeClasses}`}
        >
          {AVAILABILITY_LABELS[key]}
        </span>
      ))}
    </div>
  );
}