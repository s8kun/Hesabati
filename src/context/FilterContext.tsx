import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface SearchFilters {
  query: string;
  platform: string;
  currency: string;
  followersRange: [number, number];
  priceRange: [number, number];
}

export type FilterUpdateValue = string | [number, number];

interface FilterContextType {
  filters: SearchFilters;
  updateFilter: (key: keyof SearchFilters, value: FilterUpdateValue) => void;
  setAllFilters: (newFilters: SearchFilters) => void;
  resetFilters: () => void;
  isFiltered: boolean;
  /** True if the IP detection has completed */
  detected: boolean;
  defaultFilters: SearchFilters;
}

const defaultFilters: SearchFilters = {
  query: "",
  platform: "all",
  currency: "ALL",
  followersRange: [0, 500000],
  priceRange: [0, 10000],
};

const FilterContext = createContext<FilterContextType | null>(null);

/** Map country code → local currency */
function toCurrency(code: string): string {
  switch (code) {
    case "LY":
      return "LYD";
    case "DZ":
      return "DZD";
    case "SA":
      return "SAR";
    case "EG":
      return "EGP";
    case "AE":
      return "AED";
    case "US":
      return "USD";
    default:
      return "ALL";
  }
}

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [detected, setDetected] = useState(false);

  // Auto-detect country → currency on mount
  useEffect(() => {
    fetch("https://get.geojs.io/v1/ip/country.json")
      .then((r) => r.json())
      .then((data) => {
        const currency = toCurrency(data.country ?? "");
        if (currency !== "ALL") {
          setFilters((prev) => ({ ...prev, currency }));
        }
        setDetected(true);
      })
      .catch(() => setDetected(true));
  }, []);

  const updateFilter = (key: keyof SearchFilters, value: FilterUpdateValue) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const setAllFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => setFilters(defaultFilters);

  const isFiltered =
    filters.query !== "" ||
    filters.platform !== "all" ||
    filters.currency !== "ALL" ||
    filters.followersRange[0] !== defaultFilters.followersRange[0] ||
    filters.followersRange[1] !== defaultFilters.followersRange[1] ||
    filters.priceRange[0] !== defaultFilters.priceRange[0] ||
    filters.priceRange[1] !== defaultFilters.priceRange[1];

  return (
    <FilterContext.Provider
      value={{
        filters,
        updateFilter,
        setAllFilters,
        resetFilters,
        isFiltered,
        detected,
        defaultFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters(): FilterContextType {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within a FilterProvider");
  return ctx;
}
