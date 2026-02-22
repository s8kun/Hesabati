import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useFilters } from "@/context/FilterContext";

const platforms = [
  { value: "all", label: "كل المنصات" },
  { value: "instagram", label: "انستقرام" },
  { value: "facebook", label: "فيسبوك" },
  { value: "youtube", label: "يوتيوب" },
  { value: "x", label: "إكس (تويتر)" },
];

const countries = [
  { value: "all", label: "كل الدول" },
  { value: "ly", label: "ليبيا" },
  { value: "sa", label: "السعودية" },
  { value: "ae", label: "الإمارات" },
  { value: "eg", label: "مصر" },
  { value: "dz", label: "الجزائر" },
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

export default function SearchServices() {
  const { filters, updateFilter, resetFilters, isFiltered } = useFilters();
  const [showAdvanced, setShowAdvanced] = useState(false);
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
          <div className="px-4 text-accent shrink-0">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            id="query"
            name="query"
            value={filters.query}
            onChange={(e) => updateFilter("query", e.target.value)}
            placeholder="ابحث عن حساب... مثال: انستقرام 10K"
            className="flex-1 bg-transparent text-white text-base placeholder:text-gray-500 outline-none border-none h-full text-right pr-1"
          />

          {filters.query && (
            <button
              onClick={() => updateFilter("query", "")}
              className="px-2 text-gray-600 hover:text-gray-300 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className={`h-full px-5 flex items-center gap-2 text-sm font-bold border-r border-white/8 transition-all duration-200 shrink-0 ${
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

        {/* Active filter chips */}
        {isFiltered && (
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
            {filters.country !== "all" && (
              <Chip
                label={
                  countries.find((c) => c.value === filters.country)?.label ??
                  ""
                }
                onRemove={() => updateFilter("country", "all")}
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
              onClick={resetFilters}
              className="text-xs text-gray-600 hover:text-red-400 mr-auto transition-colors"
            >
              مسح الكل ✕
            </button>
          </div>
        )}

        {/* Filter panel */}
        {showAdvanced && (
          <div className="border-t border-white/6 px-4 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#141414]">
            <FilterSelect
              label="المنصة"
              value={filters.platform}
              onChange={(v) => updateFilter("platform", v ?? "all")}
              options={platforms}
            />
            <FilterSelect
              label="الدولة المستهدفة"
              value={filters.country}
              onChange={(v) => updateFilter("country", v ?? "all")}
              options={countries}
            />
            <FilterSelect
              label="العملة"
              value={filters.currency}
              onChange={(v) => updateFilter("currency", v ?? "ALL")}
              options={currencies}
            />
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="sm:col-span-3 text-xs text-gray-500 hover:text-red-400 transition-colors text-left"
              >
                ✕ مسح جميع الفلاتر
              </button>
            )}
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
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 bg-white/8 border-white/8 text-white text-sm focus:ring-accent">
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
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-accent/10 text-accent border border-accent/25 rounded-full px-3 py-1 hover:bg-accent/15 transition-all">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
