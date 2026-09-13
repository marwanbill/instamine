import { useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from "../../hooks/useNotifications";
import type { AppNotification } from "../../types/notification";
import { formatRelativeTime } from "../../utils/formatRelativeTime";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { data: notifications, isLoading } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  function handleNotificationClick(notification: AppNotification) {
    if (!notification.isRead) markRead(notification.id);
    if (notification.post) {
      navigate(`/gallery/${notification.post.id}`);
      setIsOpen(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Notifications"
        className="relative rounded-full p-2 text-ink/70 hover:bg-ink/5"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-gold" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-line bg-paper shadow-lg">
          <div className="flex items-center justify-between border-b border-line px-4 py-2">
            <p className="text-sm font-medium text-ink">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                className="text-xs font-medium text-blue-mid hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {isLoading && (
            <p className="px-4 py-6 text-center text-sm text-ink/50">
              Loading…
            </p>
          )}

          {!isLoading && notifications?.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-ink/50">
              Nothing new yet — you're all caught up.
            </p>
          )}

          <ul className="max-h-96 space-y-1 overflow-y-auto p-2">
            {notifications?.map((notification) => (
              <li key={notification.id}>
                <button
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-ink/5 ${
                    notification.isRead ? "text-ink/60" : "text-ink"
                  }`}
                >
                  <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-blue-deep">
                    {notification.actor?.avatarUrl ? (
                      <img
                        src={notification.actor.avatarUrl}
                        alt={notification.actor.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-paper">
                        {notification.actor?.name.charAt(0).toUpperCase() ??
                          "?"}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p>{notification.message}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-xs text-ink/40">
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                      {!notification.isRead && (
                        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                      )}
                    </div>
                  </div>

                  {notification.post && (
                    <img
                      src={notification.post.imageUrl}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-md object-cover"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
