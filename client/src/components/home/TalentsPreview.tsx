import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useUiStore } from "../../store/uiStore";
import { useTalents } from "../../hooks/useTalents";
import { TalentCard } from "../talents/TalentCard";

export function TalentsPreview() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const navigate = useNavigate();
  const { data: posts, isLoading } = useTalents();

  function handleReadMore(postId: string) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    navigate(`/talents/${postId}`);
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-semibold text-blue-deep">EnimTalents</h2>
        <a href="/talents" className="text-sm font-medium text-blue-mid hover:underline">
          See all posts
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {isLoading && <p className="col-span-full text-sm text-ink/50">Loading posts…</p>}

        {posts?.map((post) => (
          <TalentCard key={post.id} post={post} onClick={() => handleReadMore(post.id)} />
        ))}
      </div>
    </section>
  );
}