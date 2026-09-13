import type { MouseEvent } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useUiStore } from "../../store/uiStore";
import { GoogleLoginButton } from "../auth/GoogleLoginButton";
import { NotificationBell } from "../auth/NotificationBell";
import { ProfileMenu } from "../auth/ProfileMenu";
import Logo from "../../assets/Design_sans_titre__2_-removebg-preview.png";

const navItems = [
  { label: "EnimGallery", to: "/gallery" },
  { label: "EnimTalents", to: "/talents" },
  { label: "Cv", to: "/cv" },
];

export function Navbar() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useUiStore((s) => s.openAuthModal);

  function handleNavClick(e: MouseEvent<HTMLAnchorElement>) {
    if (!isAuthenticated) {
      e.preventDefault();
      openAuthModal();
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2">
            <img src={Logo} alt="InstaMine Logo" className="w-16 h-16" />
            <span className="font-display text-lg font-semibold text-blue-deep">InstaMine</span>
          </a>

          <nav className="hidden items-center gap-6 sm:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-blue-deep" : "text-ink/70 hover:text-blue-deep"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <ProfileMenu />
            </>
          ) : (
            <GoogleLoginButton />
          )}
        </div>
      </div>
    </header>
  );
}