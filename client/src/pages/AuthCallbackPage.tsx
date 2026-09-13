import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeGoogleCode } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      setError("Google sign-in was cancelled or failed.");
      return;
    }

    if (!code) {
      setError("Missing authorization code.");
      return;
    }

    exchangeGoogleCode(code)
      .then((user) => {
        setUser(user);
        const redirectTo = sessionStorage.getItem("postLoginRedirect") ?? "/";
        sessionStorage.removeItem("postLoginRedirect");
        navigate(redirectTo, { replace: true });
      })
      .catch((err) => {
        const serverMessage = err?.response?.data?.error as string | undefined;
        setError(
          serverMessage ?? "Something went wrong signing you in. Please try again."
        );
      });
  }, [searchParams, setUser, navigate]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      {error ? (
        <>
          <p className="max-w-sm text-sm text-red-600">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-sm font-medium text-blue-mid hover:underline"
          >
            Back to home
          </button>
        </>
      ) : (
        <p className="text-sm text-ink/60">Signing you in…</p>
      )}
    </div>
  );
}