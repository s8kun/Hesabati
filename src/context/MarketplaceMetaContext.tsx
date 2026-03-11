import { create } from "zustand";

export type Country = {
  id: number;
  name: string;
  currency_code?: string;
  currency_name?: string;
  rate_to_usd?: string;
};

export type Category = {
  id: number;
  name: string;
};

export type Maxes = {
  max_followers: number;
  max_price: number;
};

interface MarketplaceMetaStoreType {
  countries: Country[];
  categories: Category[];
  maxes: Maxes;
  setCountries: (value: Country[] | ((prev: Country[]) => Country[])) => void;
  setCategories: (
    value: Category[] | ((prev: Category[]) => Category[]),
  ) => void;
  setMaxes: (value: Maxes | ((prev: Maxes) => Maxes)) => void;
}

const resolveValue = <T,>(current: T, value: T | ((prev: T) => T)): T =>
  typeof value === "function" ? (value as (prev: T) => T)(current) : value;

export const useMarketplaceMetaStore = create<MarketplaceMetaStoreType>(
  (set) => ({
    countries: [],
    categories: [],
    maxes: {
      max_followers: 0,
      max_price: 0,
    },

    setCountries: (value) =>
      set((state) => ({
        countries: resolveValue(state.countries, value),
      })),

    setCategories: (value) =>
      set((state) => ({
        categories: resolveValue(state.categories, value),
      })),

    setMaxes: (value) =>
      set((state) => ({
        maxes: resolveValue(state.maxes, value),
      })),
  }),
);

export const useMarketplaceMeta = useMarketplaceMetaStore;
