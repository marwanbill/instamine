import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useUpdateTalentPost } from "../../hooks/useTalentPost";
import { TALENT_CATEGORY_LABELS } from "../../types/talent";
import type { TalentCategory, TalentPost } from "../../types/talent";

interface EditTalentPostModalProps {
  post: TalentPost;
  onClose: () => void;
}

const categories = Object.keys(TALENT_CATEGORY_LABELS) as TalentCategory[];

export function EditTalentPostModal({ post, onClose }: EditTalentPostModalProps) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [category, setCategory] = useState<TalentCategory>(post.category);
  const { mutate, isPending, error } = useUpdateTalentPost(post.id);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    mutate(
      { title: title.trim(), content: content.trim(), category },
      { onSuccess: onClose }
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-line bg-paper p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-ink/50 hover:text-ink"
        >
          <X size={18} />
        </button>

        <h2 className="font-display text-lg font-semibold text-blue-deep">Edit post</h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-ink/70">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue-mid"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ink/70">Description</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={2000}
              rows={3}
              required
              className="mt-1 w-full resize-none rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue-mid"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ink/70">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TalentCategory)}
              className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-blue-mid"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {TALENT_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-xs text-red-600">Something went wrong — try again.</p>}

          <button
            type="submit"
            disabled={isPending || !title.trim() || !content.trim()}
            className="w-full rounded-full bg-blue-deep py-2 text-sm font-medium text-paper disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}