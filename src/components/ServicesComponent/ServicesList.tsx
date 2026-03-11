import { useEffect, useMemo, useState } from "react";
import { useFilters } from "@/context/FilterContext";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Send,
  MessageCircle,
  Linkedin,
  Globe,
} from "lucide-react";
import { useMarketplaceData } from "@/data/services";

const formatFollowers = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
  </svg>
);

const getPlatformIcon = (platform: string) => {
  const normalized = platform.toLowerCase();

  if (normalized.includes("instagram")) {
    return <Instagram className="w-4 h-4 md:w-5 md:h-5" />;
  }
  if (normalized.includes("youtube")) {
    return <Youtube className="w-4 h-4 md:w-5 md:h-5" />;
  }
  if (normalized.includes("facebook")) {
    return <Facebook className="w-4 h-4 md:w-5 md:h-5" />;
  }
  if (normalized.includes("twitter") || normalized.includes("x")) {
    return <Twitter className="w-4 h-4 md:w-5 md:h-5" />;
  }
  if (normalized.includes("tiktok")) {
    return <TikTokIcon className="w-4 h-4 md:w-5 md:h-5" />;
  }
  if (normalized.includes("telegram")) {
    return <Send className="w-4 h-4 md:w-5 md:h-5" />;
  }
  if (normalized.includes("whatsapp")) {
    return <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />;
  }
  if (normalized.includes("linkedin")) {
    return <Linkedin className="w-4 h-4 md:w-5 md:h-5" />;
  }

  return <Globe className="w-4 h-4 md:w-5 md:h-5" />;
};

const getVisiblePaginationItems = (
  currentPageIndex: number,
  totalPages: number,
): Array<number | "..."> => {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const pages = new Set<number>([0, 1, 2, totalPages - 1, currentPageIndex]);
  const sortedPages = Array.from(pages)
    .filter((page) => page >= 0 && page < totalPages)
    .sort((a, b) => a - b);

  const items: Array<number | "..."> = [];
  for (let i = 0; i < sortedPages.length; i += 1) {
    const page = sortedPages[i];
    const prev = sortedPages[i - 1];

    if (i > 0 && page - prev > 1) {
      items.push("...");
    }

    items.push(page);
  }

  return items;
};

type AnnouncementRow = {
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
  seller: {
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
};

const columnHelper = createColumnHelper<AnnouncementRow>();

export default function ServicesList() {
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  );

  const { filters, detected, defaultFilters } = useFilters();
  const { results, isLoading, error, meta } = useMarketplaceData(
    pageIndex + 1,
    pageSize,
    filters,
    defaultFilters,
  );

  useEffect(() => {
    setPagination((prev) =>
      prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 },
    );
  }, [
    filters.categoryId,
    filters.countryId,
    filters.query,
    filters.followersRange,
    filters.priceRange,
  ]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("category", {
        header: "المنصة",
        cell: (info) => (
          <span
            className="inline-flex items-center justify-center bg-background px-3 py-1.5 rounded-lg border border-white/10 text-accent"
            title={info.getValue()}
            aria-label={info.getValue()}
          >
            {getPlatformIcon(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("title", {
        header: "العنوان (الإعلان)",
        cell: (info) => {
          const isSold = info.row.original.status === "sold";
          return (
            <span
              className={`font-medium text-xs md:text-sm max-w-50 md:max-w-xs block truncate ${
                isSold ? "text-gray-400 line-through" : "text-white"
              }`}
              title={info.getValue()}
            >
              {info.getValue()}
            </span>
          );
        },
      }),
      columnHelper.accessor("followers", {
        header: "المتابعين",
        cell: (info) => (
          <span
            className="font-mono text-gray-200 font-bold bg-white/5 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md inline-block text-xs md:text-sm"
            dir="ltr"
          >
            {formatFollowers(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("account_created_at", {
        header: "سنة الإنشاء",
        cell: (info) => (
          <span className="font-mono text-gray-400 text-xs md:text-sm">
            {info.getValue() ? info.getValue().substring(0, 4) : "-"}
          </span>
        ),
      }),
      columnHelper.accessor("price_usd", {
        header: "السعر",
        cell: (info) => {
          const priceValue = parseFloat(info.getValue());
          return (
            <span
              className="text-accent font-bold text-sm md:text-base bg-accent/10 px-2 py-1 md:px-3 rounded-md whitespace-nowrap min-w-[80px] md:min-w-[100px] inline-block text-center"
              dir="ltr"
            >
              {`$ ${isNaN(priceValue) ? "0.00" : priceValue.toFixed(2)}`}
            </span>
          );
        },
      }),
      columnHelper.accessor("status", {
        header: "الحالة",
        cell: (info) => {
          const isSold = info.getValue() === "sold";
          return (
            <span
              className={`inline-block px-2.5 py-1 md:px-3 md:py-1.5 rounded-md text-xs md:text-sm font-bold whitespace-nowrap border ${
                isSold
                  ? "bg-red-500/10 text-red-500 border-red-500/20"
                  : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              }`}
            >
              {isSold ? "مباع" : "متاح"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "التفاصيل",
        cell: (info) => (
          <a
            href={`/services/${info.row.original.id}`}
            className="inline-flex items-center justify-center gap-1.5 md:gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-background font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl border border-primary/20 transition-all duration-300 shadow-sm whitespace-nowrap text-xs md:text-sm"
            title="عرض الحساب"
          >
            <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>عرض الحساب</span>
          </a>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: results,
    columns,
    pageCount: meta.totalPages,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (isLoading || !detected) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-400 font-medium">
          {!detected
            ? "جاري التهيئة..."
            : `جاري جلب الصفحة ${pageIndex + 1}...`}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-20">
        <div className="text-center py-10 bg-secondary/50 rounded-2xl border border-red-500/20">
          <p className="text-red-400 text-sm md:text-base">
            تعذر تحميل الإعلانات: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-16 space-y-12">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
          أحدث الإعلانات
        </h2>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-20 bg-secondary/50 rounded-2xl border border-white/5">
          <p className="text-gray-400 text-sm md:text-lg">
            لا توجد إعلانات مطابقة للفلاتر الحالية.
          </p>
        </div>
      ) : (
        <div className="w-full rounded-2xl border border-white/5 bg-secondary/50 shadow-lg overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-right text-xs md:text-sm min-w-[800px]">
              <thead className="text-gray-400 bg-secondary/80 border-b border-white/5">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        scope="col"
                        className={`px-3 py-3 md:px-4 md:py-4 font-bold whitespace-nowrap ${
                          header.column.id === "title"
                            ? "text-right w-full"
                            : "text-center"
                        }`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => {
                  const isSold = row.original.status === "sold";
                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-white/5 last:border-0 hover:bg-secondary/70 transition-all duration-200 ${
                        isSold
                          ? "bg-secondary/30 opacity-60 grayscale-[0.5]"
                          : "bg-secondary"
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={`px-3 py-3 md:px-4 md:py-4 ${
                            cell.column.id === "title"
                              ? "text-right"
                              : "text-center"
                          }`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg bg-secondary border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <div className="flex items-center gap-1">
            {getVisiblePaginationItems(
              table.getState().pagination.pageIndex,
              table.getPageCount(),
            ).map((item, idx) => {
              if (item === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-500"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={item}
                  onClick={() => table.setPageIndex(item)}
                  className={`w-8 h-8 md:w-10 md:h-10 text-xs md:text-sm rounded-lg font-mono font-bold transition-all ${
                    table.getState().pagination.pageIndex === item
                      ? "bg-accent text-background"
                      : "bg-secondary border border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg bg-secondary border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
