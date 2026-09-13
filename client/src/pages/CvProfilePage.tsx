import { useNavigate, useParams } from "react-router-dom";
import { ExternalLink, FileText, Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useAlumniProfile, useDeleteAlumniProfile } from "../hooks/useCv";
import { CareerTimeline } from "../components/cv/CareerTimeline";
import { BlockUserButton } from "../components/admin/BlockUserButton";
import { AvailabilityBadges } from "../components/cv/AvailabilityBadges";

export function CvProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const { data: profile, isLoading } = useAlumniProfile(id!);
  const { mutate: deleteProfile, isPending: isDeleting } =
    useDeleteAlumniProfile();

  if (isLoading) {
    return (
      <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-ink/50">
        Loading…
      </p>
    );
  }

  if (!profile) {
    return (
      <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-ink/50">
        Profile not found.
      </p>
    );
  }

  const isOwner = user?.id === profile.user.id;
  const isAdmin = user?.role === "ADMIN";

  function handleDelete() {
    if (!window.confirm("Delete this CV profile? This can't be undone."))
      return;
    deleteProfile(profile!.id, { onSuccess: () => navigate("/cv") });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-blue-deep">
            {profile.user.avatarUrl ? (
              <img
                src={profile.user.avatarUrl}
                alt={profile.user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-paper">
                {profile.user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-blue-deep">
              {profile.user.name}
            </h1>
            <p className="text-sm text-ink/60">
              {profile.filiere} · Promo {profile.promoYear}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {isOwner && (
            <button
              onClick={() => navigate("/cv/me/edit")}
              className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-sm text-ink/70 hover:bg-ink/5"
            >
              <Pencil size={14} /> Edit profile
            </button>
          )}
          {(isOwner || isAdmin) && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 size={14} /> Delete
            </button>
          )}
          {isAdmin && !isOwner && (
            <BlockUserButton
              userId={profile.user.id}
              isBlocked={!!profile.user.isBlocked}
            />
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-line bg-white/70 p-5">
        <p className="text-sm font-medium text-ink/50">Currently</p>
        <p className="mt-1 text-lg font-semibold text-ink">
          {profile.currentJobTitle}
        </p>
        <p className="text-sm text-ink/60">{profile.currentCompany}</p>
        <span className="mt-2 inline-block rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-medium text-ink/70">
          {profile.industry}
        </span>
      </div>

      <div className="mt-4">
        <AvailabilityBadges profile={profile} size="md" />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={profile.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-blue-deep px-4 py-2 text-sm font-medium text-paper"
        >
          <ExternalLink size={15} /> View LinkedIn
        </a>
        <a
          href={profile.cvFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink/70 hover:bg-ink/5"
        >
          <FileText size={15} /> View CV
        </a>
      </div>

      {profile.skills.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-ink/50">Skills</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-blue-deep/10 px-2.5 py-1 text-xs font-medium text-blue-deep"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm font-medium text-ink/50">Career path</p>
        <div className="mt-3">
          <CareerTimeline entries={profile.careerEntries} />
        </div>
      </div>
    </div>
  );
}
