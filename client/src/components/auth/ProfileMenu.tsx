import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, FileText, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { logoutRequest } from "../../api/auth.api";

export function ProfileMenu() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);

  if (!user) return null;

  async function handleLogout() {
    await logoutRequest();
    clear();
    setIsOpen(false);
    navigate("/");
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="block h-9 w-9 overflow-hidden rounded-full border-2 border-blue-deep"
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-blue-deep text-sm font-semibold text-paper">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-paper shadow-lg">
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-medium text-ink">{user.name}</p>
            <p className="truncate text-xs text-ink/50">{user.email}</p>
          </div>
          <nav className="p-1">
            <Link
              to="/cv"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink hover:bg-ink/5"
            >
              <FileText size={16} /> My CV
            </Link>
            {user.role === "ADMIN" && (
              <Link
                to="/admin/users"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink hover:bg-ink/5"
              >
                <ShieldCheck size={16} /> Manage users
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-ink/5"
            >
              <LogOut size={16} /> Log out
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}