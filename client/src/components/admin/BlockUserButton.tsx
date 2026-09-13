import { useState } from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { useBlockUser, useUnblockUser } from "../../hooks/useAdmin";

interface BlockUserButtonProps {
  userId: string;
  isBlocked: boolean;
}

export function BlockUserButton({ userId, isBlocked }: BlockUserButtonProps) {
  const [blocked, setBlocked] = useState(isBlocked);
  const { mutate: block, isPending: isBlocking } = useBlockUser();
  const { mutate: unblock, isPending: isUnblocking } = useUnblockUser();

  function handleClick() {
    if (blocked) {
      if (!window.confirm("Unblock this user? They'll be able to post again.")) return;
      unblock(userId, { onSuccess: () => setBlocked(false) });
    } else {
      if (!window.confirm("Block this user from posting? They'll be notified.")) return;
      block(userId, { onSuccess: () => setBlocked(true) });
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isBlocking || isUnblocking}
      className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm disabled:opacity-50 ${
        blocked
          ? "border-line text-ink/70 hover:bg-ink/5"
          : "border-red-200 text-red-600 hover:bg-red-50"
      }`}
    >
      {blocked ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
      {blocked ? "Unblock user" : "Block user"}
    </button>
  );
}