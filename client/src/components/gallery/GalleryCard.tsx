import { Heart, MessageCircle } from "lucide-react";
import type { GalleryPost } from "../../types/gallery";

interface GalleryCardProps {
  post: GalleryPost;
  onClick: () => void;
}

export function GalleryCard({ post, onClick }: GalleryCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative aspect-square overflow-hidden rounded-xl bg-blue-deep/10 text-left"
    >
      <img
        src={post.imageUrl}
        alt={post.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-ink/80 via-ink/10 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <p className="truncate text-sm font-semibold text-paper">{post.title}</p>

        <div className="mt-1 flex items-center gap-1.5">
          <div className="h-5 w-5 shrink-0 overflow-hidden rounded-full bg-blue-deep">
            {post.author.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-paper">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <p className="truncate text-xs text-paper/80">{post.author.name}</p>
        </div>

        <div className="mt-1 flex items-center gap-3 text-xs text-paper/90">
          <span className="flex items-center gap-1">
            <Heart size={13} /> {post.likesCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={13} /> {post.commentsCount}
          </span>
        </div>
      </div>
    </button>
  );
}