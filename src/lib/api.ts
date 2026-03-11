export const resolveApiUrl = (path: string) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  if (!baseUrl) {
    throw new Error("VITE_BACKEND_URL is not configured");
  }

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(path.replace(/^\//, ""), normalizedBase).toString();
};
