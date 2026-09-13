import { AvailabilityBadges } from "./AvailabilityBadges";
import type { AlumniProfile } from "../../types/alumniProfile";

interface AlumniCardProps {
  profile: AlumniProfile;
  onClick: () => void;
}

export function AlumniCard({ profile, onClick }: AlumniCardProps) {
  const visibleSkills = profile.skills.slice(0, 3);
  const extraSkillsCount = profile.skills.length - visibleSkills.length;

  return (
    <button
      onClick={onClick}
      className="flex flex-col rounded-xl border border-line bg-white/70 p-4 text-left transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-blue-deep">
          {profile.user.avatarUrl ? (
            <img
              src={profile.user.avatarUrl}
              alt={profile.user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-paper">
              {profile.user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{profile.user.name}</p>
          <p className="text-xs text-ink/50">
            {profile.filiere} · Promo {profile.promoYear}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm font-medium text-ink">{profile.currentJobTitle}</p>
      <p className="text-sm text-ink/60">{profile.currentCompany}</p>

      {visibleSkills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visibleSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-gold/20 px-2 py-0.5 text-[11px] font-medium text-ink/70"
            >
              {skill}
            </span>
          ))}
          {extraSkillsCount > 0 && (
            <span className="text-[11px] text-ink/40">+{extraSkillsCount} more</span>
          )}
        </div>
      )}

      <div className="mt-2">
        <AvailabilityBadges profile={profile} />
      </div>
    </button>
  );
}