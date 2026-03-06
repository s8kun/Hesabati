import {useEffect, useMemo, useState} from "react";
import {useFilters} from "@/context/FilterContext";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {ExternalLink, ChevronRight, ChevronLeft, Loader2} from "lucide-react";
import {useMarketplaceData} from "@/data/services"; // تأكد من المسار

// --- Helpers ---
const formatFollowers = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
};

const getVisiblePaginationItems = (currentPageIndex: number, totalPages: number): any | ("...") => {
    if (totalPages <= 6) {
        return Array.from({length: totalPages}, (_, i) => i);
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

const platformKeyMap: Record<string, string> = {
    instagram: "انستقرام",
    facebook: "فيسبوك",
    youtube: "يوتيوب",
    x: "اكس",
    tiktok: "تيك توك",
};

const countryCodeToNames: Record<string, string[]> = {
    "LY": ["libya", "lyd"],
    "DZ": ["algeria", "dzd"],
    "SA": ["saudi arabia", "sar"],
    "EG": ["egypt", "egp"],
    "AE": ["united arab emirates", "aed", "emirates"],
    "US": ["united states", "usd", "usa", "us"],
};

// --- Type Definition ---
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
    seller: {
        email: string;
        description: string;
        whatsapp: string;
        country: {
            name: string;
            currency_code: string;
            currency_name: string;
            rate_to_usd: string;
        };
    };
    platformName: string;
    platformIcon: React.ReactNode;
};

const columnHelper = createColumnHelper<AnnouncementRow>();

export default function ServicesList() {
    // 1. إدارة حالة الصفحة الحالية (TanStack يبدأ من 0)
    const [{pageIndex, pageSize}, setPagination] = useState({pageIndex: 0, pageSize: 10});
    const pagination = useMemo(() => ({pageIndex, pageSize}), [pageIndex, pageSize]);

    // 2. تمرير رقم الصفحة للـ API (الـ API يبدأ من 1)
    const {platformsData, isLoading, error, meta} = useMarketplaceData(pageIndex + 1, pageSize);

    // جلب الـ filters من الـ Context
    const {filters} = useFilters();

    useEffect(() => {
        setPagination((prev) => (prev.pageIndex === 0 ? prev : {...prev, pageIndex: 0}));
    }, [filters.platform, filters.country, filters.query, filters.followersRange, filters.priceRange]);

    // الفلترة بناءً على قيم الـ Context
    const filteredData = useMemo(() => {
        return platformsData.flatMap((platform) => {
            // فلتر المنصة (Platform)
            if (filters.platform !== "all" && filters.platform !== "") {
                const mappedPlatform = platformKeyMap[filters.platform.toLowerCase()] || filters.platform;
                const platformCat = platform.category.toLowerCase();

                if (!platformCat.includes(mappedPlatform.toLowerCase()) &&
                    !platformCat.includes(filters.platform.toLowerCase())) {
                    return []; // تجاهل هذه المنصة بالكامل إذا لم تتطابق
                }
            }

            return platform.announcements
                .filter((ann) => {
                    // فلتر الدولة (Country)
                    let countryMatch = true;
                    if (filters.country !== "ALL") {
                        const apiCountry = ann.seller?.country;
                        if (apiCountry) {
                            const keywords = countryCodeToNames[filters.country] || [];
                            countryMatch = keywords.some(k =>
                                apiCountry.name.toLowerCase().includes(k) ||
                                apiCountry.currency_code.toLowerCase() === k
                            );
                        } else {
                            countryMatch = false;
                        }
                    }

                    // فلتر البحث النصي (Query)
                    const queryMatch =
                        !filters.query || ann.title.toLowerCase().includes(filters.query.toLowerCase());

                    // فلتر المتابعين (Followers Range)
                    const followersMatch =
                        ann.followers >= filters.followersRange[0] &&
                        ann.followers <= filters.followersRange[1];

                    // فلتر السعر (Price Range)
                    const priceUsdNum = parseFloat(ann.price_usd);
                    const priceMatch =
                        !isNaN(priceUsdNum) &&
                        priceUsdNum >= filters.priceRange[0] &&
                        priceUsdNum <= filters.priceRange[1];

                    return countryMatch && queryMatch && followersMatch && priceMatch;
                })
                .map((ann) => ({
                    ...ann,
                    platformName: platform.category,
                    platformIcon: platform.icon,
                }));
        });
    }, [
        platformsData,
        filters.platform,
        filters.country,
        filters.query,
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
                    const priceValue = parseFloat(info.getValue() as string);
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
                        <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4"/>
                        <span>عرض الحساب</span>
                    </a>
                ),
            }),
        ],
        [],
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        pageCount: meta.totalPages,
        state: {pagination},
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true, // مهم جداً عشان الـ Pagination يشتغل مع الـ Backend
    });

    if (isLoading) {
        return (
            <div className="w-full max-w-5xl mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin"/>
                <p className="text-gray-400 font-medium">جاري جلب الصفحة {pageIndex + 1}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-5xl mx-auto px-4 py-20">
                <div className="text-center py-10 bg-secondary/50 rounded-2xl border border-red-500/20">
                    <p className="text-red-400 text-sm md:text-base">تعذر تحميل الإعلانات: {error}</p>
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

            {filteredData.length === 0 ? (
                <div className="text-center py-20 bg-secondary/50 rounded-2xl border border-white/5">
                    <p className="text-gray-400 text-sm md:text-lg">
                        لا توجد إعلانات مطابقة لعملية البحث وعملة الدفع المختارة.
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

            {/* Pagination Controls */}
            {meta.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="p-2 rounded-lg bg-secondary border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5"/>
                    </button>

                    <div className="flex items-center gap-1">
                        {getVisiblePaginationItems(table.getState().pagination.pageIndex, table.getPageCount()).map((item, idx) => {
                            if (item === "...") {
                                return (
                                    <span key={`ellipsis-${idx}`}
                                          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-500">
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
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5"/>
                    </button>
                </div>
            )}
        </div>
    );
}