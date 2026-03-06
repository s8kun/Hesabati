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
    country: "ALL",
    followersRange: [0, 500000],
    priceRange: [0, 10000000],
};

const FilterContext = createContext<FilterContextType | null>(null);

const SUPPORTED_COUNTRIES = ["LY", "DZ", "SA", "EG", "AE", "US"];

function toCountry(code: string): string {
    return SUPPORTED_COUNTRIES.includes(code) ? code : "ALL";
}

export function FilterProvider({children}: { children: ReactNode }) {
    const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
    const [detected, setDetected] = useState(false);

    // Auto-detect country → currency on mount
    useEffect(() => {
        fetch("https://get.geojs.io/v1/ip/country.json")
            .then((r) => r.json())
            .then((data) => {
                const country = toCountry(data.country ?? "");
                if (country !== "ALL") {
                    setFilters((prev) => ({...prev, country}));
                }
                setDetected(true);
            })
            .catch(() => setDetected(true));
    }, []);

    const updateFilter = (key: keyof SearchFilters, value: FilterUpdateValue) => {
        setFilters((prev) => ({...prev, [key]: value}));
    };

    const setAllFilters = (newFilters: SearchFilters) => {
        setFilters(newFilters);
    };

    const resetFilters = () => setFilters(defaultFilters);

    const isFiltered =
        filters.query !== "" ||
        filters.platform !== "all" ||
        filters.country !== "ALL" ||
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
