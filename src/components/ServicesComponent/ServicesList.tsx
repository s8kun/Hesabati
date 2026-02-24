import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ExternalLink, ChevronRight, ChevronLeft } from "lucide-react";
import { platformsData } from "@/data/services";

// --- Helpers ---
const formatFollowers = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

const platformKeyMap: Record<string, string> = {
  instagram: "انستقرام",
  facebook: "فيسبوك",
  youtube: "يوتيوب",
  x: "اكس",
};

// --- Type Definition ---
type AnnouncementRow = {
  id: number;
  title: string;
  description: string;
  price_original: number;
  price_usd: number;
  followers: number;
  account_created_at: string;
  status: string;
  created_at: string;
  account_link: string;
  country: string;
  seller: {
    id: number;
    user: { full_name: string };
    whatsapp: string;
    telegrame: string;
  };
  platformName: string;
  platformIcon: React.ReactNode;
};

const columnHelper = createColumnHelper<AnnouncementRow>();

export default function ServicesList() {
  const { filters } = useFilters();

  const activeCountry = filters.country;
  const activeQuery = filters.query?.trim().toLowerCase() ?? "";
  const activePlatform = filters.platform ?? "all";

  // Filter logic
  const filteredData = useMemo(() => {
    return platformsData.flatMap((platform) => {
      if (activePlatform !== "all") {
        const keyword = platformKeyMap[activePlatform] ?? "";
        if (!platform.category.includes(keyword)) return [];
      }

      return platform.announcements
        .filter((ann) => {
          const countryMatch =
            activeCountry === "ALL" || ann.country === activeCountry;
          const queryMatch =
            !activeQuery || ann.title.toLowerCase().includes(activeQuery);
          const followersMatch =
            ann.followers >= filters.followersRange[0] &&
            ann.followers <= filters.followersRange[1];
          const priceMatch =
            ann.price_usd >= filters.priceRange[0] &&
            ann.price_usd <= filters.priceRange[1];

          return countryMatch && queryMatch && followersMatch && priceMatch;
        })
        .map((ann) => ({
          ...ann,
          platformName: platform.category,
          platformIcon: platform.icon,
        }));
    });
  }, [
    activePlatform,
    activeCountry,
    activeQuery,
    filters.followersRange,
    filters.priceRange,
  ]);

  // TanStack Columns Definition
  const columns = useMemo(
    () => [
      columnHelper.accessor("platformIcon", {
        header: "المنصة",
        cell: (info) => (
          <div
            // تصغير الأيقونة ومربعها
            className="inline-flex items-center justify-center bg-background p-1.5 md:p-2 rounded-lg border border-white/10 shadow-sm [&>svg]:w-4 [&>svg]:h-4 md:[&>svg]:w-5 md:[&>svg]:h-5"
            title={info.row.original.platformName.split(" - ")[0]}
          >
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor("title", {
        header: "العنوان (الإعلان)",
        cell: (info) => {
          const isSold = info.row.original.status === "sold";
          return (
            <span
              className={`font-medium text-xs md:text-sm max-w-[200px] md:max-w-xs block truncate ${
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
            // تصغير مربع المتابعين
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
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("price_usd", {
        header: "السعر",
        cell: (info) => (
          <span
            // تصغير خط السعر (text-sm للموبايل و text-base للابتوب)
            className="text-accent font-bold text-sm md:text-base bg-accent/10 px-2 py-1 md:px-3 rounded-md whitespace-nowrap min-w-[80px] md:min-w-[100px] inline-block text-center"
            dir="ltr"
          >
            {`$ ${info.getValue().toFixed(2)}`}
          </span>
        ),
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
            // تصغير الزر والخط بداخله
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

  // TanStack Table Instance
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-16 space-y-12">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
          أحدث الإعلانات
        </h2>
      </div>

      {filteredData.length === 0 ? (
        <div className="text-center py-20 bg-secondary/50 rounded-2xl border border-white/5">
          <p className="text-gray-400 text-sm md:text-lg">
            لا توجد إعلانات مطابقة لعملية البحث وعملة الدفع المختارة.
          </p>
        </div>
      ) : (
        <div className="w-full rounded-2xl border border-white/5 bg-secondary/50 shadow-lg overflow-hidden">
          {/* حاوية الـ Scroll للموبايل */}
          <div className="overflow-x-auto w-full">
            {/* تقليل العرض الأدنى ليتناسب مع الخطوط الأصغر */}
            <table className="w-full text-right text-xs md:text-sm min-w-[800px]">
              <thead className="text-gray-400 bg-secondary/80 border-b border-white/5">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        scope="col"
                        // تم إضافة الشرط هنا لتثبيت عمود العنوان وجعله لليمين
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
                          // تم إضافة نفس الشرط هنا للمحاذاة
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

      {/* أزرار التنقل (Pagination) */}
      {table.getPageCount() > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg bg-secondary border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: table.getPageCount() }, (_, i) => i).map(
              (pageIndex) => (
                <button
                  key={pageIndex}
                  onClick={() => table.setPageIndex(pageIndex)}
                  className={`w-8 h-8 md:w-10 md:h-10 text-xs md:text-sm rounded-lg font-mono font-bold transition-all ${
                    table.getState().pagination.pageIndex === pageIndex
                      ? "bg-accent text-background"
                      : "bg-secondary border border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {pageIndex + 1}
                </button>
              ),
            )}
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
