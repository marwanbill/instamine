import { useToastStore } from "../../store/toastStore";

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  const dismissToast = useToastStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 flex-col gap-2">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          onClick={() => dismissToast(toast.id)}
          className="rounded-full bg-ink px-4 py-2 text-sm text-paper shadow-lg"
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}