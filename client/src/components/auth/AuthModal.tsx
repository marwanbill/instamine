import { X } from "lucide-react";
import { useUiStore } from "../../store/uiStore";
import { GoogleLoginButton } from "./GoogleLoginButton";

export function AuthModal() {
  const isOpen = useUiStore((s) => s.isAuthModalOpen);
  const closeAuthModal = useUiStore((s) => s.closeAuthModal);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-line bg-paper p-8 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuthModal}
          aria-label="Close"
          className="absolute right-4 top-4 text-ink/50 hover:text-ink"
        >
          <X size={18} />
        </button>

        <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-blue-deep" />

        <h2 id="auth-modal-title" className="font-display text-xl font-semibold text-blue-deep">
          Sign in to see more
        </h2>
        <p className="mt-2 text-sm text-ink/70">
          Join with your school Google account to view posts, react, and share your own moments in
          EnimGallery and EnimTalents.
        </p>

        <div className="mt-6 flex justify-center">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}
