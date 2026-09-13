import { Heart, MessageCircle } from "lucide-react";
import { formatRelativeTime } from "../../utils/formatRelativeTime";
import { TALENT_CATEGORY_LABELS } from "../../types/talent";
import type { TalentPost } from "../../types/talent";

interface TalentCardProps {
  post: TalentPost;
  onClick: () => void;
}

export function TalentCard({ post, onClick }: TalentCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-white/70">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-blue-deep/10">
        <img src={post.mediaUrl} alt={post.title} className="h-full w-full object-cover" />
        <span className="absolute left-2 top-2 rounded-full bg-blue-deep/90 px-2.5 py-1 text-[11px] font-medium text-gold backdrop-blur-sm">
          {TALENT_CATEGORY_LABELS[post.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-semibold text-ink">{post.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink/60">{post.content}</p>

        <button
          onClick={onClick}
          className="mt-2 self-start text-sm font-medium text-blue-mid hover:underline"
        >
          Read more
        </button>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 overflow-hidden rounded-full bg-blue-deep">
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
            <div>
              <p className="text-xs font-medium text-ink">{post.author.name}</p>
              <p className="text-[11px] text-ink/40">{formatRelativeTime(post.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-ink/60">
            <span className="flex items-center gap-1">
              <Heart size={13} /> {post.likesCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={13} /> {post.commentsCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}