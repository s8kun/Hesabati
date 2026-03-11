import { clearAuthCookies, getRefreshToken, setAccessToken } from "@/lib/authCookies";
import { resolveApiUrl } from "@/lib/api";

type RefreshResponse = {
  access?: string;
};

let refreshPromise: Promise<string | null> | null = null;

const redirectToLogin = () => {
  if (typeof window === "undefined") {
    return;
  }

  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
};

export const handleRefreshFailure = () => {
  clearAuthCookies();
  redirectToLogin();
};

const requestNewAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    handleRefreshFailure();
    return null;
  }

  try {
    const response = await fetch(resolveApiUrl("/token/refresh/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    const result = (await response.json().catch(() => ({}))) as RefreshResponse;

    if (!response.ok || !result.access) {
      handleRefreshFailure();
      return null;
    }

    setAccessToken(result.access);
    return result.access;
  } catch {
    handleRefreshFailure();
    return null;
  }
};

export const queueTokenRefresh = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = requestNewAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};