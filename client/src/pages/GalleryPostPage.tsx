import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useDeleteGalleryPost, useGalleryPost } from "../hooks/useGalleryPost";
import { LikeButton } from "../components/gallery/LikeButton";
import { LikersModal } from "../components/gallery/LikersModal";
import { CommentSection } from "../components/gallery/CommentSection";
import { EditPostModal } from "../components/gallery/EditPostModal";
import { BlockUserButton } from "../components/admin/BlockUserButton";

export function GalleryPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const { data: post, isLoading } = useGalleryPost(id!);
  const { mutate: deletePost, isPending: isDeleting } = useDeleteGalleryPost();

  const [isLikersOpen, setIsLikersOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isLoading) {
    return <p className="mx-auto max-w-4xl px-4 py-16 text-sm text-ink/50">Loading…</p>;
  }

  if (!post) {
    return <p className="mx-auto max-w-4xl px-4 py-16 text-sm text-ink/50">Post not found.</p>;
  }

  const isOwner = user?.id === post.author.id;
  const isAdmin = user?.role === "ADMIN";
  const canDelete = isOwner || isAdmin;

  function handleDelete() {
    if (!window.confirm("Delete this picture? This can't be undone.")) return;
    deletePost(post!.id, { onSuccess: () => navigate("/gallery") });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <img src={post.imageUrl} alt={post.title} className="max-h-[70vh] w-full object-contain bg-ink/5" />

        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-semibold text-blue-deep">{post.title}</h1>
              <p className="mt-1 text-sm text-ink/60">by {post.author.name}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {isOwner && (
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-sm text-ink/70 hover:bg-ink/5"
                >
                  <Pencil size={14} /> Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={14} /> Delete
                </button>
              )}
              {isAdmin && !isOwner && (
                <BlockUserButton userId={post.author.id} isBlocked={!!post.author.isBlocked} />
              )}
            </div>
          </div>

          {post.caption && <p className="mt-4 text-sm text-ink/80">{post.caption}</p>}

          <div className="mt-5 flex items-center gap-3">
            <LikeButton postId={post.id} isLiked={!!post.isLikedByMe} likesCount={post.likesCount} />
            {post.likesCount > 0 && (
              <button
                onClick={() => setIsLikersOpen(true)}
                className="text-sm font-medium text-blue-mid hover:underline"
              >
                See who liked this
              </button>
            )}
          </div>

          <CommentSection postId={post.id} />
        </div>
      </div>

      {isLikersOpen && <LikersModal postId={post.id} onClose={() => setIsLikersOpen(false)} />}
      {isEditOpen && <EditPostModal post={post} onClose={() => setIsEditOpen(false)} />}
    </div>
  );
}