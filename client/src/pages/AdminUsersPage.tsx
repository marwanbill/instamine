import { useState } from "react";
import { Navigate } from "react-router-dom";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useAdminUsers, useBlockUser, useUnblockUser } from "../hooks/useAdmin";
import type { AdminUser } from "../types/adminUser";

export function AdminUsersPage() {
  const currentUser = useAuthStore((s) => s.user);
  const [search, setSearch] = useState("");

  const { data: users, isLoading } = useAdminUsers(search || undefined);

  if (currentUser && currentUser.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-2xl font-semibold text-blue-deep">Users</h1>
      <p className="mt-1 text-sm text-ink/60">
        {users ? `${users.length} user${users.length === 1 ? "" : "s"}` : "Loading…"}
      </p>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email…"
        className="mt-4 w-full max-w-sm rounded-full border border-line px-4 py-2 text-sm outline-none focus:border-blue-mid"
      />

      <div className="mt-6 overflow-hidden rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink/5 text-xs uppercase text-ink/50">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Posts</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-ink/50">
                  Loading…
                </td>
              </tr>
            )}

            {users?.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}

            {!isLoading && users?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-ink/50">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserRow({ user }: { user: AdminUser }) {
  const { mutate: block, isPending: isBlocking } = useBlockUser();
  const { mutate: unblock, isPending: isUnblocking } = useUnblockUser();

  function handleToggle() {
    if (user.isBlocked) {
      if (!window.confirm(`Unblock ${user.name}? They'll be able to post again.`)) return;
      unblock(user.id);
    } else {
      if (!window.confirm(`Block ${user.name} from posting? They'll be notified.`)) return;
      block(user.id);
    }
  }

  return (
    <tr>
      <td className="flex items-center gap-2 px-4 py-3">
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-blue-deep">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-paper">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="font-medium text-ink">{user.name}</p>
          <p className="text-xs text-ink/50">{user.email}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            user.role === "ADMIN" ? "bg-gold/30 text-ink/80" : "bg-ink/5 text-ink/60"
          }`}
        >
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3 text-ink/70">
        {user._count.galleryPosts + user._count.talentPosts}
      </td>
      <td className="px-4 py-3 text-ink/50">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        {user.isBlocked ? (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            Blocked
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            Active
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        {user.role !== "ADMIN" && (
          <button
            onClick={handleToggle}
            disabled={isBlocking || isUnblocking}
            className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs disabled:opacity-50 ${
              user.isBlocked
                ? "border-line text-ink/70 hover:bg-ink/5"
                : "border-red-200 text-red-600 hover:bg-red-50"
            }`}
          >
            {user.isBlocked ? <ShieldCheck size={12} /> : <ShieldOff size={12} />}
            {user.isBlocked ? "Unblock" : "Block"}
          </button>
        )}
      </td>
    </tr>
  );
}