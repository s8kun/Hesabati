import { useState, useEffect } from "react";
import { useFilters } from "@/context/FilterContext";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// Data Structure: Category -> Array of Announcements
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

export default function ServicesList() {
  const { filters } = useFilters();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

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

  const activeCurrency = filters.currency;
  const activeQuery = filters.query?.trim().toLowerCase() ?? "";
  const activePlatform = filters.platform ?? "all";

  // Filter logic
  const filteredAnnouncements = platformsData.flatMap((platform) => {
    // Platform filter
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
        return currencyMatch && queryMatch;
      })
      .map((ann) => ({
        ...ann,
        platformName: platform.category,
        platformIcon: platform.icon,
      }));
  });

  const totalAnnouncements = filteredAnnouncements.length;

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(totalAnnouncements / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAnnouncements = filteredAnnouncements.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-16 space-y-12">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl font-bold text-white tracking-wide">
          أحدث الإعلانات
        </h2>
      </div>

      {filteredAnnouncements.length === 0 ? (
        <div className="text-center py-20 bg-secondary/50 rounded-2xl border border-white/5">
          <p className="text-gray-400 text-lg">
            لا توجد إعلانات مطابقة لعملية البحث وعملة الدفع المختارة.
          </p>
        </div>
      ) : (
        <div className="w-full rounded-2xl border border-white/5 bg-secondary/50 shadow-lg overflow-hidden">
          <table className="w-full text-right text-sm">
            <thead className="text-gray-400 bg-secondary/80 border-b border-white/5">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-5 font-bold text-center w-20"
                >
                  المنصة
                </th>
                <th scope="col" className="px-6 py-5 font-bold">
                  العنوان (الإعلان)
                </th>
                <th scope="col" className="px-6 py-5 font-bold text-center">
                  المتابعين
                </th>
                <th scope="col" className="px-6 py-5 font-bold text-center">
                  سنة الإنشاء
                </th>
                <th scope="col" className="px-6 py-5 font-bold text-center">
                  السعر
                </th>
                <th scope="col" className="px-6 py-5 font-bold text-center">
                  التفاصيل
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedAnnouncements.map((announcement) => (
                <tr
                  key={announcement.id}
                  className="border-bottom border-white/5 last:border-0 bg-secondary hover:bg-secondary/70 transition-all duration-200"
                >
                  <td className="px-6 py-5 text-center">
                    <div
                      className="inline-flex items-center justify-center bg-background p-2.5 rounded-lg border border-white/10 shadow-sm [&>svg]:w-5 [&>svg]:h-5"
                      title={announcement.platformName.split(" - ")[0]}
                    >
                      {announcement.platformIcon}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className="font-medium text-white text-base max-w-xs block truncate"
                      title={announcement.title}
                    >
                      {announcement.title}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className="font-mono text-gray-200 font-bold bg-white/5 px-2 py-1 rounded-md"
                      dir="ltr"
                    >
                      {formatFollowers(announcement.followers)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="font-mono text-gray-400">
                      {announcement.account_created_at}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-accent font-bold text-lg bg-accent/10 px-3 py-1 rounded-md whitespace-nowrap min-w-[100px] inline-block text-center">
                      {getFormattedPrice(
                        announcement.price,
                        announcement.currency,
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <a
                      href={announcement.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-background font-bold px-4 py-2.5 rounded-xl border border-primary/20 transition-all duration-300 shadow-sm whitespace-nowrap"
                      title="عرض الحساب"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>عرض الحساب</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev - 1, totalPages))
            }
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-secondary border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="الصفحة التالية"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-mono font-bold transition-all ${
                  currentPage === page
                    ? "bg-accent text-background"
                    : "bg-secondary border border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev + 1, 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-secondary border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="الصفحة السابقة"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
