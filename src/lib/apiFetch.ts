import { getAccessToken } from "@/lib/authCookies";
import { resolveApiUrl } from "@/lib/api";
import { queueTokenRefresh } from "@/utils/tokenManager";

export type ApiFetchOptions = RequestInit & {
  auth?: boolean;
  skipRefresh?: boolean;
};

export const safeParseJson = async <T = unknown>(response: Response) =>
  ((await response.json().catch(() => ({}))) as T);

const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;

const toRequestUrl = (input: string | URL) => {
  const value = input instanceof URL ? input.toString() : input;
  return ABSOLUTE_URL_PATTERN.test(value) ? value : resolveApiUrl(value);
};

const withAuthHeader = (
  headers: HeadersInit | undefined,
  accessToken: string | undefined,
) => {
  const nextHeaders = new Headers(headers);

  if (accessToken && !nextHeaders.has("Authorization")) {
    nextHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  return nextHeaders;
};

export async function apiFetch(
  input: string | URL,
  options: ApiFetchOptions = {},
) {
  const { auth = true, skipRefresh = false, headers, ...init } = options;
  const requestUrl = toRequestUrl(input);
  const isRefreshRequest = requestUrl.includes("/token/refresh/");

  const performRequest = (accessToken?: string) =>
    fetch(requestUrl, {
      ...init,
      headers: auth ? withAuthHeader(headers, accessToken) : headers,
    });

  let response = await performRequest(getAccessToken());

  if (
    response.status !== 401 ||
    !auth ||
    skipRefresh ||
    isRefreshRequest
  ) {
    return response;
  }

  const newAccessToken = await queueTokenRefresh();

  if (!newAccessToken) {
    return response;
  }

  response = await performRequest(newAccessToken);
  return response;
}

export async function apiFetchJson<T = unknown>(
  input: string | URL,
  options: ApiFetchOptions = {},
) {
  const response = await apiFetch(input, options);
  const data = await safeParseJson<T>(response);

  return { response, data };
}