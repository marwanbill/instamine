import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useDeleteTalentPost, useTalentPost } from "../hooks/useTalentPost";
import { TalentLikeButton } from "../components/talents/TalentLikeButton";
import { TalentLikersModal } from "../components/talents/TalentLikersModal";
import { TalentCommentSection } from "../components/talents/TalentCommentSection";
import { EditTalentPostModal } from "../components/talents/EditTalentPostModal";
import { BlockUserButton } from "../components/admin/BlockUserButton";
import { TALENT_CATEGORY_LABELS } from "../types/talent";
import { formatRelativeTime } from "../utils/formatRelativeTime";

export function TalentPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const { data: post, isLoading } = useTalentPost(id!);
  const { mutate: deletePost, isPending: isDeleting } = useDeleteTalentPost();

  const [isLikersOpen, setIsLikersOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isLoading) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-ink/50">Loading…</p>;
  }

  if (!post) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-ink/50">Post not found.</p>;
  }

  const isOwner = user?.id === post.author.id;
  const isAdmin = user?.role === "ADMIN";
  const canDelete = isOwner || isAdmin;

  function handleDelete() {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    deletePost(post!.id, { onSuccess: () => navigate("/talents") });
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <div className="relative overflow-hidden rounded-2xl">
        <img src={post.mediaUrl} alt={post.title} className="w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-blue-deep/90 px-3 py-1 text-xs font-medium text-gold backdrop-blur-sm">
          {TALENT_CATEGORY_LABELS[post.category]}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-blue-deep">{post.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-blue-deep">
              {post.author.avatarUrl ? (
                <img
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-paper">
                  {post.author.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <p className="text-sm text-ink/60">
              {post.author.name} · {formatRelativeTime(post.createdAt)}
            </p>
          </div>
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

      <p className="mt-6 whitespace-pre-line text-ink/80">{post.content}</p>

      <div className="mt-5 flex items-center gap-3">
        <TalentLikeButton postId={post.id} isLiked={!!post.isLikedByMe} likesCount={post.likesCount} />
        {post.likesCount > 0 && (
          <button
            onClick={() => setIsLikersOpen(true)}
            className="text-sm font-medium text-blue-mid hover:underline"
          >
            See who liked this
          </button>
        )}
      </div>

      <TalentCommentSection postId={post.id} />

      {isLikersOpen && <TalentLikersModal postId={post.id} onClose={() => setIsLikersOpen(false)} />}
      {isEditOpen && <EditTalentPostModal post={post} onClose={() => setIsEditOpen(false)} />}
    </article>
  );
}