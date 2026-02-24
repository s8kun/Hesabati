import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// --- Helpers ---
const getFormattedPrice = (price: number, curr: string) => {
  switch (curr) {
    case "USD":
      return `$ ${price.toFixed(2)}`;
    case "LYD":
      return `${price.toFixed(2)} د.ل`;
    case "EGP":
      return `${price.toFixed(2)} ج.م`;
    case "SAR":
      return `${price.toFixed(2)} ر.س`;
    case "DZD":
      return `${price.toFixed(2)} د.ج`;
    case "AED":
      return `${price.toFixed(2)} د.إ`;
    default:
      return `${price} ${curr}`;
  }
};

const formatFollowers = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

// --- Data Structure ---
const platformsData = [
  {
    category: "انستقرام - Instagram",
    icon: <Instagram className="w-6 h-6 text-pink-500" />,
    announcements: [
      {
        id: 1,
        title: "حساب انستقرام 10K متابع متفاعل",
        price: 45.0,
        currency: "USD",
        followers: 10500,
        account_created_at: "2020",
        seller: { name: "أحمد", whatsapp: "+218910000000" },
        status: "active",
        link: "#",
      },
      {
        id: 2,
        title: "حساب انستقرام 50K متابع حقيقي",
        price: 840.0,
        currency: "LYD",
        followers: 50000,
        account_created_at: "2018",
        seller: { name: "عمر", whatsapp: "+218920000000" },
        status: "active",
        link: "#",
      },
      {
        id: 3,
        title: "حساب انستقرام - 5K متابع",
        price: 5000.0,
        currency: "DZD",
        followers: 5000,
        account_created_at: "2023",
        seller: { name: "سالم", whatsapp: "+218940000000" },
        status: "active",
        link: "#",
      },
      {
        id: 10,
        title: "حساب مميز نيتش طبخ 20K متابع",
        price: 90.0,
        currency: "USD",
        followers: 21000,
        account_created_at: "2021",
        seller: { name: "فاطمة", whatsapp: "+218911111111" },
        status: "active",
        link: "#",
      },
      {
        id: 11,
        title: "انستغرام 100K نشط جدا خليجي",
        price: 350.0,
        currency: "USD",
        followers: 102000,
        account_created_at: "2017",
        seller: { name: "يوسف", whatsapp: "+218922222222" },
        status: "active",
        link: "#",
      },
      {
        id: 12,
        title: "حساب شخصي 3K متابع - توثيق قديم",
        price: 150.0,
        currency: "LYD",
        followers: 3200,
        account_created_at: "2015",
        seller: { name: "خالد", whatsapp: "+218933333333" },
        status: "active",
        link: "#",
      },
      {
        id: 13,
        title: "حساب انستقرام أجنبي 15K",
        price: 120.0,
        currency: "USD",
        followers: 15500,
        account_created_at: "2022",
        seller: { name: "سمير", whatsapp: "+218944444444" },
        status: "active",
        link: "#",
      },
    ],
  },
  {
    category: "فيسبوك - Facebook",
    icon: <Facebook className="w-6 h-6 text-blue-500" />,
    announcements: [
      {
        id: 4,
        title: "صفحة فيسبوك 100K متابع نشط",
        price: 1500.0,
        currency: "EGP",
        followers: 100000,
        account_created_at: "2018",
        seller: { name: "محمد", whatsapp: "+218920000000" },
        status: "active",
        link: "#",
      },
      {
        id: 5,
        title: "حساب فيسبوك شخصي قديم (2010)",
        price: 70.0,
        currency: "LYD",
        followers: 1500,
        account_created_at: "2010",
        seller: { name: "أحمد", whatsapp: "+218910000000" },
        status: "active",
        link: "#",
      },
      {
        id: 14,
        title: "جروب فيسبوك 50K عضو متفاعل",
        price: 250.0,
        currency: "USD",
        followers: 52000,
        account_created_at: "2019",
        seller: { name: "طارق", whatsapp: "+218955555555" },
        status: "active",
        link: "#",
      },
      {
        id: 15,
        title: "صفحة تجارية جاهزة للإعلانات",
        price: 300.0,
        currency: "LYD",
        followers: 8000,
        account_created_at: "2020",
        seller: { name: "مصطفى", whatsapp: "+218966666666" },
        status: "active",
        link: "#",
      },
      {
        id: 16,
        title: "حساب مطور فيسبوك قديم 2008",
        price: 100.0,
        currency: "USD",
        followers: 500,
        account_created_at: "2008",
        seller: { name: "حسين", whatsapp: "+218977777777" },
        status: "active",
        link: "#",
      },
    ],
  },
  {
    category: "يوتيوب - YouTube",
    icon: <Youtube className="w-6 h-6 text-red-500" />,
    announcements: [
      {
        id: 6,
        title: "قناة يوتيوب مفعلة الدخل (1K مشترك)",
        price: 550.0,
        currency: "SAR",
        followers: 1500,
        account_created_at: "2021",
        seller: { name: "سالم", whatsapp: "+218940000000" },
        status: "active",
        link: "#",
      },
      {
        id: 7,
        title: "قناة يوتيوب 10K مشترك (بدون دخل)",
        price: 90.0,
        currency: "USD",
        followers: 10000,
        account_created_at: "2018",
        seller: { name: "علي", whatsapp: "+218910000000" },
        status: "active",
        link: "#",
      },
      {
        id: 17,
        title: "قناة يوتيوب جيمنج 50K مشترك وتحقيق أرباح",
        price: 1200.0,
        currency: "USD",
        followers: 51000,
        account_created_at: "2016",
        seller: { name: "بدر", whatsapp: "+218988888888" },
        status: "active",
        link: "#",
      },
      {
        id: 18,
        title: "قناة شورتس مشاهدات عالية 5K",
        price: 200.0,
        currency: "LYD",
        followers: 5500,
        account_created_at: "2023",
        seller: { name: "نور", whatsapp: "+218999999999" },
        status: "active",
        link: "#",
      },
    ],
  },
  {
    category: "اكس (تويتر) - X",
    icon: <Twitter className="w-6 h-6 text-white" />,
    announcements: [
      {
        id: 8,
        title: "حساب إكس موثق (العلامة الزرقاء)",
        price: 310.0,
        currency: "AED",
        followers: 5000,
        account_created_at: "2015",
        seller: { name: "علي", whatsapp: "+218910000000" },
        status: "active",
        link: "#",
      },
      {
        id: 9,
        title: "حساب تويتر 20K متابع متفاعل",
        price: 420.0,
        currency: "LYD",
        followers: 20000,
        account_created_at: "2019",
        seller: { name: "عمر", whatsapp: "+218920000000" },
        status: "active",
        link: "#",
      },
      {
        id: 19,
        title: "إكس 100K تفاعل رياضي نار",
        price: 800.0,
        currency: "USD",
        followers: 105000,
        account_created_at: "2014",
        seller: { name: "مالك", whatsapp: "+218912345678" },
        status: "active",
        link: "#",
      },
      {
        id: 20,
        title: "حساب مميز جدا حرفين",
        price: 5000.0,
        currency: "USD",
        followers: 1200,
        account_created_at: "2011",
        seller: { name: "تركي", whatsapp: "+218987654321" },
        status: "active",
        link: "#",
      },
    ],
  },
];

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
  price: number;
  currency: string;
  followers: number;
  account_created_at: string;
  link: string;
  platformName: string;
  platformIcon: React.ReactNode;
};

const columnHelper = createColumnHelper<AnnouncementRow>();

export default function ServicesList() {
  const { filters } = useFilters();

  const activeCurrency = filters.currency;
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
          const currencyMatch =
            activeCurrency === "ALL" || ann.currency === activeCurrency;
          const queryMatch =
            !activeQuery || ann.title.toLowerCase().includes(activeQuery);
          const followersMatch =
            ann.followers >= filters.followersRange[0] &&
            ann.followers <= filters.followersRange[1];
          const priceMatch =
            ann.price >= filters.priceRange[0] &&
            ann.price <= filters.priceRange[1];

          return currencyMatch && queryMatch && followersMatch && priceMatch;
        })
        .map((ann) => ({
          ...ann,
          platformName: platform.category,
          platformIcon: platform.icon,
        }));
    });
  }, [
    activePlatform,
    activeCurrency,
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
        cell: (info) => (
          <span
            // تصغير خط العنوان (text-xs للموبايل و text-sm للابتوب)
            className="font-medium text-white text-xs md:text-sm max-w-[200px] md:max-w-xs block truncate"
            title={info.getValue()}
          >
            {info.getValue()}
          </span>
        ),
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
      columnHelper.accessor("price", {
        header: "السعر",
        cell: (info) => (
          <span
            // تصغير خط السعر (text-sm للموبايل و text-base للابتوب)
            className="text-accent font-bold text-sm md:text-base bg-accent/10 px-2 py-1 md:px-3 rounded-md whitespace-nowrap min-w-[80px] md:min-w-[100px] inline-block text-center"
          >
            {getFormattedPrice(info.getValue(), info.row.original.currency)}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "التفاصيل",
        cell: (info) => (
          <a
            href={info.row.original.link}
            target="_blank"
            rel="noreferrer"
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
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-white/5 last:border-0 bg-secondary hover:bg-secondary/70 transition-all duration-200"
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
                ))}
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
