import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { useFilters } from "@/context/FilterContext";

const platforms = [
  { value: "all", label: "كل المنصات" },
  { value: "instagram", label: "انستقرام" },
  { value: "facebook", label: "فيسبوك" },
  { value: "youtube", label: "يوتيوب" },
  { value: "x", label: "إكس (تويتر)" },
];

const currencies = [
  { value: "ALL", label: "كل العملات" },
  { value: "USD", label: "USD ($)" },
  { value: "LYD", label: "LYD (د.ل)" },
  { value: "DZD", label: "DZD (د.ج)" },
  { value: "SAR", label: "SAR (ر.س)" },
  { value: "EGP", label: "EGP (ج.م)" },
  { value: "AED", label: "AED (د.إ)" },
];

function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export default function SearchServices() {
  const {
    filters,
    updateFilter,
    setAllFilters,
    resetFilters,
    isFiltered,
    defaultFilters,
  } = useFilters();

  const [localFilters, setLocalFilters] = useState(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sync draft state if global filters change externally (e.g. from removing a chip or reset)
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    setAllFilters(localFilters);
    setShowAdvanced(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  const updateLocal = (key: keyof typeof defaultFilters, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const hasVisibleChips =
    filters.platform !== "all" ||
    filters.currency !== "ALL" ||
    filters.followersRange[0] !== defaultFilters.followersRange[0] ||
    filters.followersRange[1] !== defaultFilters.followersRange[1] ||
    filters.priceRange[0] !== defaultFilters.priceRange[0] ||
    filters.priceRange[1] !== defaultFilters.priceRange[1];

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
        {/* Input row */}
        <div className="flex items-center h-14">
          <button
            onClick={handleApply}
            className="px-4 text-accent shrink-0 hover:scale-110 transition-transform"
            title="بحث"
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
            placeholder="ابحث عن حساب... مثال: انستقرام 10K"
            className="flex-1 min-w-0 bg-transparent text-white text-sm sm:text-base placeholder:text-gray-500 outline-none border-none h-full text-right pr-1"
          />

          {localFilters.query && (
            <button
              onClick={() => updateLocal("query", "")}
              className="px-2 text-gray-600 hover:text-gray-300 transition-colors shrink-0"
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
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">بحث متقدم</span>
            {isFiltered && (
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            )}
          </button>
        </div>

        {/* Active filter chips (applied globally) */}
        {hasVisibleChips && (
          <div className="flex items-center gap-2 px-4 py-2.5 border-t border-white/6 flex-wrap">
            {filters.platform !== "all" && (
              <Chip
                label={
                  platforms.find((p) => p.value === filters.platform)?.label ??
                  ""
                }
                onRemove={() => updateFilter("platform", "all")}
              />
            )}
            {(filters.followersRange[0] !== defaultFilters.followersRange[0] ||
              filters.followersRange[1] !==
                defaultFilters.followersRange[1]) && (
              <Chip
                label={`المتابعين: ${formatNumber(filters.followersRange[0])} - ${formatNumber(filters.followersRange[1])}`}
                onRemove={() =>
                  updateFilter("followersRange", defaultFilters.followersRange)
                }
              />
            )}
            {(filters.priceRange[0] !== defaultFilters.priceRange[0] ||
              filters.priceRange[1] !== defaultFilters.priceRange[1]) && (
              <Chip
                label={`السعر: ${filters.priceRange[0]} - ${filters.priceRange[1]}`}
                onRemove={() =>
                  updateFilter("priceRange", defaultFilters.priceRange)
                }
              />
            )}
            {filters.currency !== "ALL" && (
              <Chip
                label={
                  currencies.find((c) => c.value === filters.currency)?.label ??
                  ""
                }
                onRemove={() => updateFilter("currency", "ALL")}
              />
            )}
            <button
              onClick={() => {
                resetFilters();
                setLocalFilters(defaultFilters);
              }}
              className="text-xs text-gray-600 hover:text-red-400 mr-auto transition-colors"
            >
              مسح الكل ✕
            </button>
          </div>
        )}

        {/* Filter panel */}
        {showAdvanced && (
          <div className="border-t border-white/6 px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#141414]">
            <div className="space-y-6">
              <FilterSelect
                label="المنصة"
                value={localFilters.platform}
                onChange={(v) => updateLocal("platform", v ?? "all")}
                options={platforms}
              />
              <FilterSelect
                label="العملة"
                value={localFilters.currency}
                onChange={(v) => updateLocal("currency", v ?? "ALL")}
                options={currencies}
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
                  max={500000}
                  step={1000}
                  value={localFilters.followersRange}
                  onValueChange={(v) => updateLocal("followersRange", v)}
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
                  max={10000}
                  step={100}
                  value={localFilters.priceRange}
                  onValueChange={(v) => updateLocal("priceRange", v)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-white/5 mt-4 sm:mt-2">
              <button
                onClick={() => setLocalFilters(filters)}
                className="px-5 py-3 sm:py-2.5 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 sm:hover:bg-transparent rounded-xl transition-colors text-center"
              >
                تجاهل
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-3 sm:py-2.5 text-sm font-bold text-black bg-accent hover:bg-accent/90 rounded-xl transition-all shadow-lg shadow-accent/20 text-center"
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
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem className="bg-[#1e1e1e]" key={o.value} value={o.value}>
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
      <span dir="ltr">{label}</span>
      <button onClick={onRemove} className="hover:text-white transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  );
}
