import { useState, useEffect } from "react";
import { useMarketplaceMeta } from "@/context/MarketplaceMetaContext";
import { apiFetch } from "@/lib/apiFetch";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_MAX_FOLLOWERS = 500000;
const DEFAULT_MAX_PRICE = 10000000;

export type Seller = {
  user?: {
    id: number;
    email: string;
    full_name: string;
  };
  email?: string;
  description: string;
  whatsapp: string;
  country: {
    id?: number;
    name: string;
    currency_code?: string;
    currency_name?: string;
    rate_to_usd?: string;
  };
};

export type Announcement = {
  id: number;
  title: string;
  description: string;
  price_original: string;
  price_usd: string;
  followers: number;
  account_created_at: string;
  status: string;
  created_at: string;
  account_link: string;
  category: string;
  seller: Seller;
};

export type Country = {
  id: number;
  name: string;
};

export type Category = {
  id: number;
  name: string;
};

type PaginatedAnnouncementsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Announcement[];
  countries?: Country[];
  categories?: Category[];
  max_followers?: number;
  max_price?: number;
};

export type MarketplaceMeta = {
  count: number;
  pageSize: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type MarketplaceFilters = {
  query: string;
  categoryId: string;
  countryId: string;
  followersRange: [number, number];
  priceRange: [number, number];
};

export const useMarketplaceData = (
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE,
  filters?: MarketplaceFilters,
  defaultFilters?: MarketplaceFilters,
) => {
  const [results, setResults] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<MarketplaceMeta>({
    count: 0,
    pageSize,
    totalPages: 0,
    currentPage: page,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const { setCountries, setCategories, setMaxes } = useMarketplaceMeta();

  const query = filters?.query ?? "";
  const categoryId = filters?.categoryId ?? "";
  const countryId = filters?.countryId ?? "";
  const followersMin = filters?.followersRange?.[0] ?? 0;
  const followersMax = filters?.followersRange?.[1] ?? 0;
  const priceMin = filters?.priceRange?.[0] ?? 0;
  const priceMax = filters?.priceRange?.[1] ?? 0;

  const defaultFollowersMin = defaultFilters?.followersRange?.[0] ?? 0;
  const defaultFollowersMax =
    defaultFilters?.followersRange?.[1] ?? DEFAULT_MAX_FOLLOWERS;
  const defaultPriceMin = defaultFilters?.priceRange?.[0] ?? 0;
  const defaultPriceMax = defaultFilters?.priceRange?.[1] ?? DEFAULT_MAX_PRICE;

  useEffect(() => {
    const abortController = new AbortController();

    const fetchAnnouncements = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        if (!baseUrl) {
          throw new Error("VITE_BACKEND_URL is not configured");
        }

        const hasQuery = !!query.trim();

        const hasAdvancedFilters =
          !!categoryId ||
          !!countryId ||
          followersMin !== defaultFollowersMin ||
          followersMax !== defaultFollowersMax ||
          priceMin !== defaultPriceMin ||
          priceMax !== defaultPriceMax;

        let endpoint = baseUrl;

        if (hasQuery) {
          endpoint = `${baseUrl}/announcements/search/`;
        } else if (hasAdvancedFilters) {
          endpoint = `${baseUrl}/announcements/filter/`;
        }

        const url = new URL(endpoint);

        url.searchParams.set("page", String(page));

        if (!hasQuery && !hasAdvancedFilters) {
          url.searchParams.set("page_size", String(pageSize));
        }

        if (hasQuery) {
          url.searchParams.set("search", query.trim());
        }

        if (hasAdvancedFilters) {
          if (categoryId) {
            url.searchParams.set("category_id", categoryId);
          }

          if (countryId) {
            url.searchParams.set("country_id", countryId);
          }

          if (followersMin > 0) {
            url.searchParams.set("min_followers", String(followersMin));
          }

          if (followersMax < defaultFollowersMax) {
            url.searchParams.set("max_followers", String(followersMax));
          }

          if (priceMin > 0) {
            url.searchParams.set("min_price", String(priceMin));
          }

          if (priceMax < defaultPriceMax) {
            url.searchParams.set("max_price", String(priceMax));
          }
        }

        const response = await apiFetch(url.toString(), {
          auth: false,
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const json = (await response.json()) as PaginatedAnnouncementsResponse;

        const totalPages =
          json.count > 0 ? Math.ceil(json.count / DEFAULT_PAGE_SIZE) : 0;

        setResults(json.results);

        if (json.countries?.length) {
          setCountries(json.countries);
        }

        if (json.categories?.length) {
          setCategories(json.categories);
        }

        setMeta({
          count: json.count,
          pageSize: DEFAULT_PAGE_SIZE,
          totalPages,
          currentPage: page,
          hasNextPage: json.next !== null,
          hasPreviousPage: json.previous !== null,
        });

        // Keep max boundaries stable while user is filtering/searching.
        // Updating these from filtered responses causes slider values to jump.
        if (!hasQuery && !hasAdvancedFilters) {
          setMaxes({
            max_followers: json.max_followers || 0,
            max_price: Math.ceil(json.max_price || 0),
          });
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Error fetching announcements:", error);
        setResults([]);
        setMeta((prev) => ({
          ...prev,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }));
        setError(
          error instanceof Error ? error.message : "Failed to load announcements",
        );
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchAnnouncements();

    return () => {
      abortController.abort();
    };
  }, [
    page,
    pageSize,
    query,
    categoryId,
    countryId,
    followersMin,
    followersMax,
    priceMin,
    priceMax,
    defaultFollowersMin,
    defaultFollowersMax,
    defaultPriceMin,
    defaultPriceMax,
    setCountries,
    setCategories,
    setMaxes,
  ]);

  return {
    results,
    isLoading,
    error,
    meta,
  };
};