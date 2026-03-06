import type {ReactNode} from "react";
import {useState, useEffect} from "react";
import {Facebook, Instagram, Twitter, Youtube} from "lucide-react";

const DEFAULT_PAGE_SIZE = 10;

const TikTokIcon = ({className}: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
    </svg>
);

// 2. تحديث الـ Types لتطابق الـ API
export type Seller = {
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

export type Announcement = {
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
    seller: Seller;
};

export type PlatformData = {
    category: string;
    icon: ReactNode;
    announcements: Announcement[];
};

type PaginatedAnnouncementsResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Announcement[];
};

export type MarketplaceMeta = {
    count: number;
    pageSize: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

// 3. دالة تحديد الأيقونة والاسم (Switch)
const getCategoryMeta = (categoryName: string): { title: string; icon: ReactNode } => {
    switch (categoryName.toLowerCase()) {
        case "tiktok":
            return {title: "تيك توك - TikTok", icon: <TikTokIcon className="w-6 h-6 text-black dark:text-white"/>};
        case "instagram":
            return {title: "انستقرام - Instagram", icon: <Instagram className="w-6 h-6 text-pink-500"/>};
        case "facebook":
            return {title: "فيسبوك - Facebook", icon: <Facebook className="w-6 h-6 text-blue-500"/>};
        case "youtube":
            return {title: "يوتيوب - YouTube", icon: <Youtube className="w-6 h-6 text-red-500"/>};
        case "x":
        case "twitter":
            return {title: "اكس (تويتر) - X", icon: <Twitter className="w-6 h-6 text-gray-800 dark:text-gray-200"/>};
        default:
            return {title: categoryName, icon: null};
    }
};

// 4. دالة البحث عن الخدمة (تستقبل البيانات كمعامل)
export const getServiceById = (
    id: number,
    platformsData: PlatformData[]
): (Announcement & { platformName: string; platformIcon: ReactNode }) | undefined => {
    for (const platform of platformsData) {
        const ann = platform.announcements.find((a) => a.id === id);
        if (ann) {
            return {
                ...ann,
                platformName: platform.category,
                platformIcon: platform.icon,
            };
        }
    }
    return undefined;
};

// 5. الـ Hook الأساسي اللي بتستدعيه في الـ Components بتاعك
export const useMarketplaceData = (page: number = 1, pageSize: number = DEFAULT_PAGE_SIZE) => {
    const [platformsData, setPlatformsData] = useState<PlatformData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [meta, setMeta] = useState<MarketplaceMeta>({
        count: 0,
        pageSize,
        totalPages: 0,
        currentPage: page,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    useEffect(() => {
        const abortController = new AbortController();

        const fetchAnnouncements = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const baseUrl = import.meta.env.VITE_BACKEND_URL;
                if (!baseUrl) {
                    throw new Error("VITE_BACKEND_URL is not configured");
                }

                const url = new URL(baseUrl);
                url.searchParams.set("page", String(page));
                url.searchParams.set("page_size", String(pageSize));

                const response = await fetch(url.toString(), {signal: abortController.signal});
                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const json = (await response.json()) as PaginatedAnnouncementsResponse;

                const resolvedPageSize = pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE;
                const totalPages = json.count > 0 ? Math.ceil(json.count / resolvedPageSize) : 0;

                const grouped = json.results.reduce((acc: Record<string, PlatformData>, announcement: Announcement) => {
                    const meta = getCategoryMeta(announcement.category);
                    if (!acc[meta.title]) {
                        acc[meta.title] = {category: meta.title, icon: meta.icon, announcements: []};
                    }
                    acc[meta.title].announcements.push(announcement);
                    return acc;
                }, {});

                setPlatformsData(Object.values(grouped));
                setMeta({
                    count: json.count,
                    pageSize: resolvedPageSize,
                    totalPages,
                    currentPage: page,
                    hasNextPage: json.next !== null,
                    hasPreviousPage: json.previous !== null,
                });
            } catch (error) {
                if (error instanceof DOMException && error.name === "AbortError") {
                    return;
                }

                console.error("Error fetching announcements:", error);
                setPlatformsData([]);
                setMeta((prev) => ({...prev, totalPages: 0, hasNextPage: false, hasPreviousPage: false}));
                setError(error instanceof Error ? error.message : "Failed to load announcements");
            } finally {
                if (!abortController.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchAnnouncements();

        return () => {
            abortController.abort();
        };
    }, [page, pageSize]); // إعادة الجلب كلما تغيرت الصفحة

    return {
        platformsData,
        isLoading,
        error,
        meta,
    };
};