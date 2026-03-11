import { Cookies } from "react-cookie";

export const ACCESS_TOKEN_COOKIE = "token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

const cookies = new Cookies();
const authCookieOptions = {
  path: "/",
  sameSite: "lax" as const,
};

export const getAuthCookies = () => cookies;

export const getAccessToken = () =>
  cookies.get(ACCESS_TOKEN_COOKIE) as string | undefined;

export const getRefreshToken = () =>
  cookies.get(REFRESH_TOKEN_COOKIE) as string | undefined;

export const setAccessToken = (accessToken: string) => {
  cookies.set(ACCESS_TOKEN_COOKIE, accessToken, authCookieOptions);
};

export const setRefreshToken = (refreshToken: string) => {
  cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, authCookieOptions);
};

export const setAuthTokens = (tokens: {
  access?: string;
  refresh?: string;
}) => {
  if (tokens.access) {
    setAccessToken(tokens.access);
  }

  if (tokens.refresh) {
    setRefreshToken(tokens.refresh);
  }
};

export const clearAuthCookies = () => {
  cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" });
  cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/services" });
  cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });
  cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/services" });
};

export const extractAuthTokens = (payload: Record<string, unknown>) => ({
  access:
    typeof payload.access === "string"
      ? payload.access
      : typeof payload.access_token === "string"
        ? payload.access_token
        : undefined,
  refresh:
    typeof payload.refresh === "string"
      ? payload.refresh
      : typeof payload.refresh_token === "string"
        ? payload.refresh_token
        : undefined,
});