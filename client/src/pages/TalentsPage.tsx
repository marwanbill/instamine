import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";
import { useTalents } from "../hooks/useTalents";
import { TalentCard } from "../components/talents/TalentCard";
import { TalentUploadModal } from "../components/talents/TalentUploadModal";
import image_2 from "../assets/297624948_3355022438061510_1213355752055811695_n.jpg";

export function TalentsPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const navigate = useNavigate();

  const [sort, setSort] = useState<"recent" | "popular">("recent");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const { data: posts, isLoading } = useTalents(sort);

  function handleAddClick() {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setIsUploadOpen(true);
  }

  function handleReadMore(postId: string) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    navigate(`/talents/${postId}`);
  }

  return (
    <>
      <section
        className="relative flex h-64 items-center justify-center bg-cover bg-center sm:h-72"
        style={{
          backgroundImage:
            `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
          url("${image_2}")`,
        }}
      >
        <div className="px-6 text-center">
          <h1 className="font-display text-3xl font-semibold text-paper sm:text-5xl">
            Welcome to Talents
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-paper/80 sm:text-base">
            Drawings, stories, designs, and everything alumni have been creating.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex overflow-hidden rounded-full border border-line">
            {(["recent", "popular"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSort(option)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  sort === option ? "bg-blue-deep text-paper" : "bg-white text-ink/70 hover:bg-ink/5"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-medium text-ink hover:brightness-95"
          >
            <Plus size={16} /> Add a post
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading && <p className="col-span-full text-sm text-ink/50">Loading posts…</p>}

          {posts?.map((post) => (
            <TalentCard key={post.id} post={post} onClick={() => handleReadMore(post.id)} />
          ))}

          {!isLoading && posts?.length === 0 && (
            <p className="col-span-full text-sm text-ink/50">
              No posts yet — be the first to share.
            </p>
          )}
        </div>
      </section>

      {isUploadOpen && <TalentUploadModal onClose={() => setIsUploadOpen(false)} />}
    </>
  );
}