import { useMemo } from "react";
import { create } from "zustand";
import { useMarketplaceMeta } from "@/context/MarketplaceMetaContext";

export interface SearchFilters {
  query: string;
  categoryId: string;
  countryId: string;
  followersRange: [number, number];
  priceRange: [number, number];
}

export type FilterUpdateValue = string | [number, number];

interface FilterStoreState {
  filters: SearchFilters;
  detected: boolean;
  updateFilter: (key: keyof SearchFilters, value: FilterUpdateValue) => void;
  setAllFilters: (newFilters: SearchFilters) => void;
  resetFilters: (defaults?: SearchFilters) => void;
}

interface FilterContextType extends FilterStoreState {
  isFiltered: boolean;
  defaultFilters: SearchFilters;
}

const staticDefaultFilters: SearchFilters = {
  query: "",
  categoryId: "",
  countryId: "",
  followersRange: [0, 0],
  priceRange: [0, 0],
};

const useFilterStore = create<FilterStoreState>((set) => ({
  filters: staticDefaultFilters,
  detected: true,

  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  setAllFilters: (newFilters) => set({ filters: newFilters }),

  resetFilters: (defaults) =>
    set({
      filters: defaults || staticDefaultFilters,
    }),
}));

export function useFilters(): FilterContextType {
  const { maxes } = useMarketplaceMeta();

  const maxFollowers = maxes.max_followers || 500000;
  const maxPrice = Math.ceil(maxes.max_price || 10000000);

  const defaultFilters: SearchFilters = useMemo(
    () => ({
      query: "",
      categoryId: "",
      countryId: "",
      followersRange: [0, maxFollowers],
      priceRange: [0, maxPrice],
    }),
    [maxFollowers, maxPrice],
  );

  const { filters, updateFilter, setAllFilters, resetFilters, detected } =
    useFilterStore();

  const normalizeRange = (
    range: [number, number],
    max: number,
  ): [number, number] => {
    const min = Math.max(0, range[0]);
    const rawMax = range[1] <= 0 ? max : range[1];
    const normalizedMax = Math.min(rawMax, max);

    return [Math.min(min, normalizedMax), normalizedMax];
  };

  const normalizedFollowersRange = useMemo(
    () => normalizeRange(filters.followersRange, maxFollowers),
    [filters.followersRange, maxFollowers],
  );

  const normalizedPriceRange = useMemo(
    () => normalizeRange(filters.priceRange, maxPrice),
    [filters.priceRange, maxPrice],
  );

  const safeFilters: SearchFilters = useMemo(
    () => ({
      ...filters,
      followersRange: normalizedFollowersRange,
      priceRange: normalizedPriceRange,
    }),
    [filters, normalizedFollowersRange, normalizedPriceRange],
  );

  const isFiltered =
    safeFilters.query !== "" ||
    safeFilters.categoryId !== "" ||
    safeFilters.countryId !== "" ||
    safeFilters.followersRange[0] !== defaultFilters.followersRange[0] ||
    safeFilters.followersRange[1] !== defaultFilters.followersRange[1] ||
    safeFilters.priceRange[0] !== defaultFilters.priceRange[0] ||
    safeFilters.priceRange[1] !== defaultFilters.priceRange[1];

  return {
    filters: safeFilters,
    updateFilter,
    setAllFilters,
    resetFilters: () => resetFilters(defaultFilters),
    isFiltered,
    detected,
    defaultFilters,
  };
}
