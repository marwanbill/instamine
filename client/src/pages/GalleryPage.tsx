import { useState } from "react";
import { Plus } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";
import { useGallery } from "../hooks/useGallery";
import { GalleryHero } from "../components/gallery/GalleryHero";
import { GalleryCard } from "../components/gallery/GalleryCard";
import { GalleryUploadModal } from "../components/gallery/GalleryUploadModal";
import type { GallerySort } from "../types/gallery";
import { useNavigate } from "react-router-dom";

export function GalleryPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useUiStore((s) => s.openAuthModal);

  const [sort, setSort] = useState<GallerySort>("recent");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const { data: posts, isLoading } = useGallery(sort);

  function handleAddClick() {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setIsUploadOpen(true);
  }

  function handleCardClick(postId: string) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    navigate(`/gallery/${postId}`);
  }

  return (
    <>
      <GalleryHero />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex overflow-hidden rounded-full border border-line">
            {(["recent", "popular"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSort(option)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  sort === option
                    ? "bg-blue-deep text-paper"
                    : "bg-white text-ink/70 hover:bg-ink/5"
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
            <Plus size={16} /> Add a picture
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {isLoading && (
            <p className="col-span-full text-sm text-ink/50">Loading photos…</p>
          )}

          {posts?.map((post) => (
            <GalleryCard key={post.id} post={post} onClick={() => handleCardClick(post.id)} />
          ))}

          {!isLoading && posts?.length === 0 && (
            <p className="col-span-full text-sm text-ink/50">
              No pictures yet — be the first to post one.
            </p>
          )}
        </div>
      </section>

      {isUploadOpen && (
        <GalleryUploadModal onClose={() => setIsUploadOpen(false)} />
      )}
    </>
  );
}
