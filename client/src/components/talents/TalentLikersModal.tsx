import { X } from "lucide-react";
import { useTalentLikers } from "../../hooks/useTalentLikers";

interface TalentLikersModalProps {
  postId: string;
  onClose: () => void;
}

export function TalentLikersModal({ postId, onClose }: TalentLikersModalProps) {
  const { data: likers, isLoading } = useTalentLikers(postId, true);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-line bg-paper p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-ink/50 hover:text-ink"
        >
          <X size={18} />
        </button>

        <h2 className="font-display text-lg font-semibold text-blue-deep">Liked by</h2>

        <ul className="mt-4 max-h-80 space-y-3 overflow-y-auto">
          {isLoading && <p className="text-sm text-ink/50">Loading…</p>}

          {likers?.map((liker) => (
            <li key={liker.id} className="flex items-center gap-3">
              <div className="h-9 w-9 overflow-hidden rounded-full bg-blue-deep">
                {liker.avatarUrl ? (
                  <img src={liker.avatarUrl} alt={liker.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-paper">
                    {liker.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-sm text-ink">{liker.name}</span>
            </li>
          ))}

          {!isLoading && likers?.length === 0 && (
            <p className="text-sm text-ink/50">No likes yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}