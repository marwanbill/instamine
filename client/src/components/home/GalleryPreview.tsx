import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useUiStore } from "../../store/uiStore";
import { useGallery } from "../../hooks/useGallery";
import { GalleryCard } from "../gallery/GalleryCard";

export function GalleryPreview() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const navigate = useNavigate();
  const { data: posts, isLoading } = useGallery();

  function handleClick(photoId: string) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    navigate(`/gallery/${photoId}`);
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-semibold text-blue-deep">
          EnimGallery
        </h2>
        <Link
          to="/gallery"
          className="text-sm font-medium text-blue-mid hover:underline"
        >
          See all photos
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {isLoading && (
          <p className="col-span-full text-sm text-ink/50">Loading photos…</p>
        )}

        {posts?.map((post) => (
          <GalleryCard
            key={post.id}
            post={post}
            onClick={() => handleClick(post.id)}
          />
        ))}

        {!isAuthenticated && !isLoading && posts && posts.length > 0 && (
          <button
            onClick={() => openAuthModal()}
            className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-blue-deep/30 text-sm font-medium text-blue-deep"
          >
            Sign in to see more
          </button>
        )}
      </div>
    </section>
  );
}
