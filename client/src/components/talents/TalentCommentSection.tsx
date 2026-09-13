import { useState, type FormEvent } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  useDeleteTalentComment,
  useTalentComments,
  usePostTalentComment,
  useUpdateTalentComment,
} from "../../hooks/useTalentComments";
import { useAuthStore } from "../../store/authStore";
import { useUiStore } from "../../store/uiStore";
import { formatRelativeTime } from "../../utils/formatRelativeTime";
import type { TalentComment } from "../../types/talent";

interface TalentCommentSectionProps {
  postId: string;
}

export function TalentCommentSection({ postId }: TalentCommentSectionProps) {
  const [content, setContent] = useState("");
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useUiStore((s) => s.openAuthModal);

  const { data: comments, isLoading } = useTalentComments(postId);
  const { mutate: postComment, isPending } = usePostTalentComment(postId);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    if (!content.trim()) return;

    postComment(content.trim(), { onSuccess: () => setContent("") });
  }

  return (
    <div className="mt-8">
      <h2 className="font-display text-lg font-semibold text-blue-deep">Comments</h2>

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          placeholder={isAuthenticated ? "Write a comment…" : "Sign in to comment"}
          className="flex-1 rounded-full border border-line px-4 py-2 text-sm outline-none focus:border-blue-mid"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-blue-deep px-4 py-2 text-sm font-medium text-paper disabled:opacity-50"
        >
          Post
        </button>
      </form>

      <ul className="mt-5 space-y-4">
        {isLoading && <p className="text-sm text-ink/50">Loading comments…</p>}

        {comments?.map((comment) => (
          <TalentCommentItem
            key={comment.id}
            postId={postId}
            comment={comment}
            isOwner={user?.id === comment.author.id}
          />
        ))}

        {!isLoading && comments?.length === 0 && (
          <p className="text-sm text-ink/50">No comments yet — be the first.</p>
        )}
      </ul>
    </div>
  );
}

function TalentCommentItem({
  postId,
  comment,
  isOwner,
}: {
  postId: string;
  comment: TalentComment;
  isOwner: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);

  const { mutate: updateComment, isPending: isUpdating } = useUpdateTalentComment(postId);
  const { mutate: removeComment, isPending: isDeleting } = useDeleteTalentComment(postId);

  function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    updateComment(
      { commentId: comment.id, content: draft.trim() },
      { onSuccess: () => setIsEditing(false) }
    );
  }

  function handleDelete() {
    if (!window.confirm("Delete this comment?")) return;
    removeComment(comment.id);
  }

  return (
    <li className="flex gap-3">
      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-blue-deep">
        {comment.author.avatarUrl ? (
          <img
            src={comment.author.avatarUrl}
            alt={comment.author.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-paper">
            {comment.author.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-ink">{comment.author.name}</p>
          <span className="text-xs text-ink/40">{formatRelativeTime(comment.createdAt)}</span>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="mt-1 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={500}
              autoFocus
              className="flex-1 rounded-full border border-line px-3 py-1.5 text-sm outline-none focus:border-blue-mid"
            />
            <button
              type="submit"
              disabled={isUpdating}
              className="rounded-full bg-blue-deep px-3 py-1.5 text-xs font-medium text-paper disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(comment.content);
                setIsEditing(false);
              }}
              className="rounded-full border border-line px-3 py-1.5 text-xs text-ink/70"
            >
              Cancel
            </button>
          </form>
        ) : (
          <p className="text-sm text-ink/70">{comment.content}</p>
        )}

        {isOwner && !isEditing && (
          <div className="mt-1 flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-xs text-ink/50 hover:text-blue-mid"
            >
              <Pencil size={12} /> Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1 text-xs text-ink/50 hover:text-red-600"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        )}
      </div>
    </li>
  );
}