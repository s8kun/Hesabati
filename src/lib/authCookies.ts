import { Cookies } from "react-cookie";

export const ACCESS_TOKEN_COOKIE = "token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";
export const ROLE_COOKIE = "user_role";

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

export const getRole = () => cookies.get(ROLE_COOKIE) as string | undefined;

export const setRole = (role: string) => {
  cookies.set(ROLE_COOKIE, role, { ...authCookieOptions, expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
};

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
  cookies.remove(ROLE_COOKIE, { path: "/" });
  cookies.remove(ROLE_COOKIE, { path: "/services" });
};

const getNestedString = (
  payload: Record<string, unknown>,
  path: string[],
): string | undefined => {
  let current: unknown = payload;

  for (const segment of path) {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return typeof current === "string" ? current : undefined;
};

const findFirstTokenMatch = (
  payload: Record<string, unknown>,
  candidatePaths: string[][],
) => {
  for (const path of candidatePaths) {
    const match = getNestedString(payload, path);
    if (match) {
      return match;
    }
  }

  return undefined;
};

export const extractAuthTokens = (payload: Record<string, unknown>) => ({
  access: findFirstTokenMatch(payload, [
    ["access"],
    ["access_token"],
    ["token"],
    ["jwt"],
    ["data", "access"],
    ["data", "access_token"],
    ["data", "token"],
    ["tokens", "access"],
    ["tokens", "access_token"],
    ["results", "access"],
    ["results", "access_token"],
  ]),
  refresh: findFirstTokenMatch(payload, [
    ["refresh"],
    ["refresh_token"],
    ["data", "refresh"],
    ["data", "refresh_token"],
    ["tokens", "refresh"],
    ["tokens", "refresh_token"],
    ["results", "refresh"],
    ["results", "refresh_token"],
  ]),
});