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
  country: string;
  currency: string;
}

interface FilterContextType {
  filters: SearchFilters;
  updateFilter: (key: keyof SearchFilters, value: string) => void;
  resetFilters: () => void;
  isFiltered: boolean;
  /** True if the IP detection has completed */
  detected: boolean;
}

const defaultFilters: SearchFilters = {
  query: "",
  platform: "all",
  country: "all",
  currency: "ALL",
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

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  const isFiltered =
    filters.query !== "" ||
    filters.platform !== "all" ||
    filters.country !== "all" ||
    filters.currency !== "ALL";

  return (
    <FilterContext.Provider
      value={{ filters, updateFilter, resetFilters, isFiltered, detected }}
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
