import { useGoogleLogin } from "@react-oauth/google";

export function GoogleLoginButton() {
  const login = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
    scope: "openid email profile",
  });

  function handleClick() {
    // remember where the user was, so the callback page can send them back
    sessionStorage.setItem("postLoginRedirect", window.location.pathname);
    login();
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm hover:shadow"
    >
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.9 0-12.5-5.6-12.5-12.5S17.1 10.5 24 10.5c3.2 0 6 1.2 8.2 3.1l6-6C34.6 4.3 29.6 2.5 24 2.5 12.1 2.5 2.5 12.1 2.5 24S12.1 45.5 24 45.5 45.5 35.9 45.5 24c0-1.2-.1-2.4-.3-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.2 0 6 1.2 8.2 3.1l6-6C34.6 6.3 29.6 4.5 24 4.5c-7.7 0-14.4 4.4-17.7 10.2z" />
        <path fill="#4CAF50" d="M24 45.5c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 36.8 26.9 37.9 24 37.9c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.5 41 16.2 45.5 24 45.5z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.4C41.6 35.5 45.5 30.3 45.5 24c0-1.2-.1-2.4-.3-3.5z" />
      </svg>
      Sign in with Google
    </button>
  );
}