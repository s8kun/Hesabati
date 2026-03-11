import { resolveApiUrl } from "@/lib/api";
import { apiFetch, safeParseJson } from "@/lib/apiFetch";
import { getApiMessageInArabic } from "@/lib/toast";

export const announcementStatusOptions = [
  { value: "active", label: "نشط" },
  { value: "sold", label: "مباع" },
] as const;

export async function fetchAnnouncementCategories() {
  const url = new URL(resolveApiUrl("/"));
  url.searchParams.set("page", "1");
  url.searchParams.set("page_size", "1");

  const response = await apiFetch(url.toString(), {
    auth: false,
    headers: {
      Accept: "application/json",
    },
  });

  const result = await safeParseJson<Record<string, unknown>>(response);

  if (!response.ok) {
    throw new Error(
      getApiMessageInArabic(result, "تعذّر تحميل تصنيفات الإعلانات."),
    );
  }

  return (
    (
      result as {
        categories?: Array<{
          id: number;
          name: string;
        }>;
      }
    ).categories || []
  );
}
