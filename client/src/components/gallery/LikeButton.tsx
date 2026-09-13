import { ThumbsUp } from "lucide-react";
import { useToggleGalleryLike } from "../../hooks/useGalleryPost";
import { useAuthStore } from "../../store/authStore";
import { useUiStore } from "../../store/uiStore";
import { useToastStore } from "../../store/toastStore";

interface LikeButtonProps {
  postId: string;
  isLiked: boolean;
  likesCount: number;
}

export function LikeButton({ postId, isLiked, likesCount }: LikeButtonProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const showToast = useToastStore((s) => s.showToast);
  const { mutate, isPending } = useToggleGalleryLike(postId);

  function handleClick() {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    const wasLiked = isLiked;
    mutate(undefined, {
      onSuccess: () => {
        if (!wasLiked) showToast("You liked this post");
      },
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        isLiked
          ? "border-blue-deep bg-blue-deep/10 text-blue-deep"
          : "border-line text-ink/70 hover:bg-ink/5"
      }`}
    >
      <ThumbsUp size={16} fill={isLiked ? "currentColor" : "none"} />
      {likesCount}
    </button>
  );
}