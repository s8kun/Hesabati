import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import { useMarketplaceMeta } from "@/context/MarketplaceMetaContext";

function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

const createLocalFilters = (
  filters: ReturnType<typeof useFilters>["filters"],
  maxFollowers: number,
  maxPrice: number,
) => ({
  ...filters,
  categoryId: filters.categoryId || "all",
  countryId: filters.countryId || "all",
  followersRange: [
    Math.max(0, filters.followersRange[0]),
    Math.min(filters.followersRange[1], maxFollowers),
  ] as [number, number],
  priceRange: [
    Math.max(0, filters.priceRange[0]),
    Math.min(filters.priceRange[1], maxPrice),
  ] as [number, number],
});

export default function SearchServices() {
  const {
    filters,
    updateFilter,
    setAllFilters,
    resetFilters,
    isFiltered,
    defaultFilters,
  } = useFilters();

  const { countries, categories, maxes } = useMarketplaceMeta();
  const isMetaLoading =
    countries.length === 0 &&
    categories.length === 0 &&
    maxes.max_followers === 0 &&
    maxes.max_price === 0;

  const maxFollowers = maxes?.max_followers ?? defaultFilters.followersRange[1];
  const maxPrice = Math.ceil(maxes?.max_price ?? defaultFilters.priceRange[1]);

  const effectiveDefaultFilters = useMemo(
    () => ({
      ...defaultFilters,
      followersRange: [0, maxFollowers] as [number, number],
      priceRange: [0, maxPrice] as [number, number],
    }),
    [defaultFilters, maxFollowers, maxPrice],
  );

  const categoriesOptions = useMemo(
    () => [
      { value: "all", label: "كل المنصات" },
      ...categories.map((item) => ({
        value: String(item.id),
        label: item.name,
      })),
    ],
    [categories],
  );

  const countriesOptions = useMemo(
    () => [
      { value: "all", label: "كل الدول" },
      ...countries.map((item) => ({
        value: String(item.id),
        label: item.name,
      })),
    ],
    [countries],
  );

  const [localFilters, setLocalFilters] = useState(() =>
    createLocalFilters(filters, maxFollowers, maxPrice),
  );

  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const nextLocalFilters = createLocalFilters(filters, maxFollowers, maxPrice);
    const frameId = window.requestAnimationFrame(() => {
      setLocalFilters(nextLocalFilters);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [filters, maxFollowers, maxPrice]);

  const handleApply = () => {
    setAllFilters({
      ...localFilters,
      categoryId:
        localFilters.categoryId === "all" ? "" : localFilters.categoryId,
      countryId: localFilters.countryId === "all" ? "" : localFilters.countryId,
      followersRange: [
        Math.max(0, localFilters.followersRange[0]),
        Math.min(localFilters.followersRange[1], maxFollowers),
      ] as [number, number],
      priceRange: [
        Math.max(0, localFilters.priceRange[0]),
        Math.min(localFilters.priceRange[1], maxPrice),
      ] as [number, number],
    });

    setShowAdvanced(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  const updateLocal = (
    key: keyof typeof localFilters,
    value: string | [number, number] | null,
  ) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value ?? "" }));
  };

  const hasVisibleChips =
    !isMetaLoading &&
    (filters.categoryId !== "" ||
      filters.countryId !== "" ||
      filters.followersRange[0] !== effectiveDefaultFilters.followersRange[0] ||
      filters.followersRange[1] !== effectiveDefaultFilters.followersRange[1] ||
      filters.priceRange[0] !== effectiveDefaultFilters.priceRange[0] ||
      filters.priceRange[1] !== effectiveDefaultFilters.priceRange[1]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mb-10 mt-8">
      <div
        className="relative rounded-xl overflow-hidden border bg-[#181818]"
        style={{
          borderColor: "rgba(212,175,55,0.35)",
          boxShadow:
            "0 0 0 1px rgba(212,175,55,0.08), 0 8px 40px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex items-center h-14">
          <button
            onClick={handleApply}
            className="px-4 text-accent shrink-0 hover:scale-110 transition-transform"
            title="بحث"
            type="button"
          >
            <Search className="w-5 h-5" />
          </button>

          <input
            type="text"
            id="query"
            name="query"
            value={localFilters.query}
            onChange={(e) => updateLocal("query", e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ابحث عن حساب... مثال: Account 27"
            className="flex-1 min-w-0 bg-transparent text-white text-sm sm:text-base placeholder:text-gray-500 outline-none border-none h-full text-right pr-1"
          />

          {localFilters.query && (
            <button
              onClick={() => updateLocal("query", "")}
              className="px-2 text-gray-600 hover:text-gray-300 transition-colors shrink-0"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className={`h-full px-3 sm:px-5 flex items-center gap-2 text-sm font-bold border-r border-white/8 transition-all duration-200 shrink-0 ${
              showAdvanced || isFiltered
                ? "text-gray-200 bg-white/8"
                : "text-gray-400 hover:text-gray-200 hover:bg-white/4"
            }`}
            type="button"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">بحث متقدم</span>
            {!isMetaLoading && isFiltered && (
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            )}
          </button>
        </div>

        {hasVisibleChips && (
          <div className="flex items-center gap-2 px-4 py-2.5 border-t border-white/6 flex-wrap">
            {filters.categoryId !== "" && (
              <Chip
                label={
                  categoriesOptions.find((c) => c.value === filters.categoryId)
                    ?.label ?? ""
                }
                onRemove={() => updateFilter("categoryId", "")}
              />
            )}

            {filters.countryId !== "" && (
              <Chip
                label={
                  countriesOptions.find((c) => c.value === filters.countryId)
                    ?.label ?? ""
                }
                onRemove={() => updateFilter("countryId", "")}
              />
            )}

            {(filters.followersRange[0] !==
              effectiveDefaultFilters.followersRange[0] ||
              filters.followersRange[1] !==
                effectiveDefaultFilters.followersRange[1]) && (
              <Chip
                label={`المتابعين: ${formatNumber(filters.followersRange[0])} - ${formatNumber(filters.followersRange[1])}`}
                onRemove={() =>
                  updateFilter(
                    "followersRange",
                    effectiveDefaultFilters.followersRange,
                  )
                }
              />
            )}

            {(filters.priceRange[0] !== effectiveDefaultFilters.priceRange[0] ||
              filters.priceRange[1] !==
                effectiveDefaultFilters.priceRange[1]) && (
              <Chip
                label={`السعر: ${filters.priceRange[0]} - ${filters.priceRange[1]}`}
                onRemove={() =>
                  updateFilter("priceRange", effectiveDefaultFilters.priceRange)
                }
              />
            )}

            <button
              onClick={() => {
                resetFilters();
                setLocalFilters({
                  ...effectiveDefaultFilters,
                  categoryId: "all",
                  countryId: "all",
                });
              }}
              className="text-xs text-gray-600 hover:text-red-400 mr-auto transition-colors"
              type="button"
            >
              مسح الكل ✕
            </button>
          </div>
        )}

        {showAdvanced && (
          <div className="border-t border-white/6 px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#141414]">
            <div className="space-y-6">
              <FilterSelect
                label="المنصة"
                value={localFilters.categoryId}
                onChange={(v) => updateLocal("categoryId", v)}
                options={categoriesOptions}
              />

              <FilterSelect
                label="الدولة"
                value={localFilters.countryId}
                onChange={(v) => updateLocal("countryId", v)}
                options={countriesOptions}
              />
            </div>

            <div className="space-y-8 mt-2 md:mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 font-medium tracking-wide">
                    عدد المتابعين
                  </p>
                  <p className="text-sm font-bold text-accent" dir="ltr">
                    {formatNumber(localFilters.followersRange[0])} -{" "}
                    {formatNumber(localFilters.followersRange[1])}
                  </p>
                </div>

                <Slider
                  min={0}
                  max={maxFollowers}
                  step={1000}
                  value={localFilters.followersRange}
                  onValueChange={(v) =>
                    updateLocal("followersRange", v as [number, number])
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 font-medium tracking-wide">
                    نطاق السعر
                  </p>
                  <p className="text-sm font-bold text-accent" dir="ltr">
                    {localFilters.priceRange[0]} - {localFilters.priceRange[1]}
                  </p>
                </div>

                <Slider
                  min={0}
                  max={maxPrice}
                  step={100}
                  value={localFilters.priceRange}
                  onValueChange={(v) =>
                    updateLocal("priceRange", v as [number, number])
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-white/5 mt-4 sm:mt-2">
              <button
                onClick={() =>
                  setLocalFilters(
                    createLocalFilters(filters, maxFollowers, maxPrice),
                  )
                }
                className="px-5 py-3 sm:py-2.5 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 sm:hover:bg-transparent rounded-xl transition-colors text-center"
                type="button"
              >
                تجاهل
              </button>

              <button
                onClick={handleApply}
                className="px-6 py-3 sm:py-2.5 text-sm font-bold text-black bg-accent hover:bg-accent/90 rounded-xl transition-all shadow-lg shadow-accent/20 text-center"
                type="button"
              >
                تطبيق الفلاتر والبحث
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string | null) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-gray-500 font-medium tracking-wide">{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 bg-black/40 border-white/10 text-white text-sm focus:ring-accent md:h-12 rounded-xl transition-all">
          <SelectValue placeholder={`اختر ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem
              className="bg-[#1e1e1e] hover:bg-accent"
              key={o.value}
              value={o.value}
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-accent/10 text-accent border border-accent/25 rounded-full px-3 py-1.5 hover:bg-accent/15 transition-all">
      <span dir="auto">{label}</span>
      <button
        onClick={onRemove}
        className="hover:text-white transition-colors"
        type="button"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  );
}
