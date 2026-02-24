import type { ReactNode } from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export type Seller = {
  id: number;
  user: { full_name: string };
  whatsapp: string;
  telegrame: string;
};

export type Announcement = {
  id: number;
  title: string;
  description: string;
  price_original: number;
  price_usd: number;
  country: string;
  followers: number;
  account_created_at: string;
  seller: Seller;
  status: string;
  created_at: string;
  account_link: string;
};

export type PlatformData = {
  category: string;
  icon: ReactNode;
  announcements: Announcement[];
};

export const platformsData: PlatformData[] = [
  {
    category: "انستقرام - Instagram",
    icon: <Instagram className="w-6 h-6 text-pink-500" />,
    announcements: [
      {
        id: 1,
        title: "حساب انستقرام 10K متابع متفاعل",
        description: "وصف الإعلان",
        price_original: 45.0,
        price_usd: 45.0,
        country: "US",
        followers: 10500,
        account_created_at: "2020",
        seller: {
          id: 1,
          user: { full_name: "أحمد" },
          whatsapp: "+218910000000",
          telegrame: "@أحمد_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
      },
      {
        id: 2,
        title: "حساب انستقرام 50K متابع حقيقي",
        description: "وصف الإعلان",
        price_original: 840.0,
        price_usd: 168.0,
        country: "LY",
        followers: 50000,
        account_created_at: "2018",
        seller: {
          id: 2,
          user: { full_name: "عمر" },
          whatsapp: "+218920000000",
          telegrame: "@عمر_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
      },
      {
        id: 3,
        title: "حساب انستقرام - 5K متابع",
        description: "وصف الإعلان",
        price_original: 5000.0,
        price_usd: 1000.0,
        country: "DZ",
        followers: 5000,
        account_created_at: "2023",
        seller: {
          id: 3,
          user: { full_name: "سالم" },
          whatsapp: "+218940000000",
          telegrame: "@سالم_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
      },
      {
        id: 10,
        title: "حساب مميز نيتش طبخ 20K متابع",
        description: "وصف الإعلان",
        price_original: 90.0,
        price_usd: 90.0,
        country: "US",
        followers: 21000,
        account_created_at: "2021",
        seller: {
          id: 10,
          user: { full_name: "فاطمة" },
          whatsapp: "+218911111111",
          telegrame: "@فاطمة_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
      },
      {
        id: 11,
        title: "انستغرام 100K نشط جدا خليجي",
        description: "وصف الإعلان",
        price_original: 350.0,
        price_usd: 350.0,
        country: "US",
        followers: 102000,
        account_created_at: "2017",
        seller: {
          id: 11,
          user: { full_name: "يوسف" },
          whatsapp: "+218922222222",
          telegrame: "@يوسف_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
      },
      {
        id: 12,
        title: "حساب شخصي 3K متابع - توثيق قديم",
        description: "وصف الإعلان",
        price_original: 150.0,
        price_usd: 30.0,
        country: "LY",
        followers: 3200,
        account_created_at: "2015",
        seller: {
          id: 12,
          user: { full_name: "خالد" },
          whatsapp: "+218933333333",
          telegrame: "@خالد_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
      },
      {
        id: 13,
        title: "حساب انستقرام أجنبي 15K",
        description: "وصف الإعلان",
        price_original: 120.0,
        price_usd: 120.0,
        country: "US",
        followers: 15500,
        account_created_at: "2022",
        seller: {
          id: 13,
          user: { full_name: "سمير" },
          whatsapp: "+218944444444",
          telegrame: "@سمير_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
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
        description: "وصف الإعلان",
        price_original: 1500.0,
        price_usd: 300.0,
        country: "EG",
        followers: 100000,
        account_created_at: "2018",
        seller: {
          id: 4,
          user: { full_name: "محمد" },
          whatsapp: "+218920000000",
          telegrame: "@محمد_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
      },
      {
        id: 5,
        title: "حساب فيسبوك شخصي قديم (2010)",
        description: "وصف الإعلان",
        price_original: 70.0,
        price_usd: 14.0,
        country: "LY",
        followers: 1500,
        account_created_at: "2010",
        seller: {
          id: 5,
          user: { full_name: "أحمد" },
          whatsapp: "+218910000000",
          telegrame: "@أحمد_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
      },
      {
        id: 14,
        title: "جروب فيسبوك 50K عضو متفاعل",
        description: "وصف الإعلان",
        price_original: 250.0,
        price_usd: 250.0,
        country: "US",
        followers: 52000,
        account_created_at: "2019",
        seller: {
          id: 14,
          user: { full_name: "طارق" },
          whatsapp: "+218955555555",
          telegrame: "@طارق_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
      },
      {
        id: 15,
        title: "صفحة تجارية جاهزة للإعلانات",
        description: "وصف الإعلان",
        price_original: 300.0,
        price_usd: 60.0,
        country: "LY",
        followers: 8000,
        account_created_at: "2020",
        seller: {
          id: 15,
          user: { full_name: "مصطفى" },
          whatsapp: "+218966666666",
          telegrame: "@مصطفى_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
      },
      {
        id: 16,
        title: "حساب مطور فيسبوك قديم 2008",
        description: "وصف الإعلان",
        price_original: 100.0,
        price_usd: 100.0,
        country: "US",
        followers: 500,
        account_created_at: "2008",
        seller: {
          id: 16,
          user: { full_name: "حسين" },
          whatsapp: "+218977777777",
          telegrame: "@حسين_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
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
        description: "وصف الإعلان",
        price_original: 550.0,
        price_usd: 110.0,
        country: "SA",
        followers: 1500,
        account_created_at: "2021",
        seller: {
          id: 6,
          user: { full_name: "سالم" },
          whatsapp: "+218940000000",
          telegrame: "@سالم_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
      },
      {
        id: 7,
        title: "قناة يوتيوب 10K مشترك (بدون دخل)",
        description: "وصف الإعلان",
        price_original: 90.0,
        price_usd: 90.0,
        country: "US",
        followers: 10000,
        account_created_at: "2018",
        seller: {
          id: 7,
          user: { full_name: "علي" },
          whatsapp: "+218910000000",
          telegrame: "@علي_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
      },
      {
        id: 17,
        title: "قناة يوتيوب جيمنج 50K مشترك وتحقيق أرباح",
        description: "وصف الإعلان",
        price_original: 1200.0,
        price_usd: 1200.0,
        country: "US",
        followers: 51000,
        account_created_at: "2016",
        seller: {
          id: 17,
          user: { full_name: "بدر" },
          whatsapp: "+218988888888",
          telegrame: "@بدر_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
      },
      {
        id: 18,
        title: "قناة شورتس مشاهدات عالية 5K",
        description: "وصف الإعلان",
        price_original: 200.0,
        price_usd: 40.0,
        country: "LY",
        followers: 5500,
        account_created_at: "2023",
        seller: {
          id: 18,
          user: { full_name: "نور" },
          whatsapp: "+218999999999",
          telegrame: "@نور_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
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
        description: "وصف الإعلان",
        price_original: 310.0,
        price_usd: 62.0,
        country: "AE",
        followers: 5000,
        account_created_at: "2015",
        seller: {
          id: 8,
          user: { full_name: "علي" },
          whatsapp: "+218910000000",
          telegrame: "@علي_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
      },
      {
        id: 9,
        title: "حساب تويتر 20K متابع متفاعل",
        description: "وصف الإعلان",
        price_original: 420.0,
        price_usd: 84.0,
        country: "LY",
        followers: 20000,
        account_created_at: "2019",
        seller: {
          id: 9,
          user: { full_name: "عمر" },
          whatsapp: "+218920000000",
          telegrame: "@عمر_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
      },
      {
        id: 19,
        title: "إكس 100K تفاعل رياضي نار",
        description: "وصف الإعلان",
        price_original: 800.0,
        price_usd: 800.0,
        country: "US",
        followers: 105000,
        account_created_at: "2014",
        seller: {
          id: 19,
          user: { full_name: "مالك" },
          whatsapp: "+218912345678",
          telegrame: "@مالك_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
      },
      {
        id: 20,
        title: "حساب مميز جدا حرفين",
        description: "وصف الإعلان",
        price_original: 5000.0,
        price_usd: 5000.0,
        country: "US",
        followers: 1200,
        account_created_at: "2011",
        seller: {
          id: 20,
          user: { full_name: "تركي" },
          whatsapp: "+218987654321",
          telegrame: "@تركي_tg",
        },
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        account_link: "#",
      },
    ],
  },
];

export const getServiceById = (
  id: number,
):
  | (Announcement & { platformName: string; platformIcon: ReactNode })
  | undefined => {
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
