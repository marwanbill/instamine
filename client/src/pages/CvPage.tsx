import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useAlumniDirectory, useMyProfile } from "../hooks/useCv";
import { AlumniCard } from "../components/cv/AlumniCard";
import { AlumniFiltersBar } from "../components/cv/AlumniFilters";
import type { AlumniFilters } from "../types/alumniProfile";

export function CvPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [filters, setFilters] = useState<AlumniFilters>({});

  const { data: myProfile, isLoading: isMyProfileLoading } = useMyProfile();
  const { data: profiles, isLoading } = useAlumniDirectory(filters);

  return (
    <>
      <section
        className="relative flex h-64 items-center justify-center bg-cover bg-center sm:h-72"
        style={{
          backgroundImage:
            "linear-gradient(rgba(11,46,89,0.6), rgba(11,46,89,0.6)), linear-gradient(135deg, #0B2E59 0%, #1B4B8F 60%, #14171A 100%)",
        }}
      >
        <div className="px-6 text-center">
          <h1 className="font-display text-3xl font-semibold text-paper sm:text-5xl">
            Alumni Directory
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-paper/80 sm:text-base">
            Find graduates by filière, industry, or skill — see where they've ended up.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {!isMyProfileLoading && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-line bg-gold/10 px-4 py-3">
            <p className="text-sm text-ink/70">
              {myProfile
                ? "Your profile is live in the directory."
                : "Add your profile so students in your filière can find you."}
            </p>
            <button
              onClick={() => navigate("/cv/me/edit")}
              className="rounded-full bg-blue-deep px-4 py-1.5 text-sm font-medium text-paper"
            >
              {myProfile ? "Edit my profile" : "Add my profile"}
            </button>
          </div>
        )}

        <AlumniFiltersBar filters={filters} onChange={setFilters} />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading && <p className="col-span-full text-sm text-ink/50">Loading…</p>}

          {profiles?.map((profile) => (
            <AlumniCard
              key={profile.id}
              profile={profile}
              onClick={() => navigate(`/cv/${profile.id}`)}
            />
          ))}

          {!isLoading && profiles?.length === 0 && (
            <p className="col-span-full text-sm text-ink/50">No matching profiles found.</p>
          )}
        </div>
      </section>
    </>
  );
}