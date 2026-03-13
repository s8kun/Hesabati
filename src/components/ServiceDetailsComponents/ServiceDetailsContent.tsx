import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

import useMeta from "../../hooks/useMeta";
import {
  ArrowRight,
  MessageCircle,
  Loader2,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Send,
  Linkedin,
  Globe,
} from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";

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

const getPlatformIcon = (platform: string, className = "w-4 h-4") => {
  const normalized = platform.toLowerCase();

  if (normalized.includes("instagram")) {
    return <Instagram className={className} />;
  }
  if (normalized.includes("youtube")) {
    return <Youtube className={className} />;
  }
  if (normalized.includes("facebook")) {
    return <Facebook className={className} />;
  }
  if (normalized.includes("twitter") || normalized.includes("x")) {
    return <Twitter className={className} />;
  }
  if (normalized.includes("tiktok")) {
    return <TikTokIcon className={className} />;
  }
  if (normalized.includes("telegram")) {
    return <Send className={className} />;
  }
  if (normalized.includes("whatsapp")) {
    return <MessageCircle className={className} />;
  }
  if (normalized.includes("linkedin")) {
    return <Linkedin className={className} />;
  }

  return <Globe className={className} />;
};

type ServiceDetails = {
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
    email: string;
    description: string;
    whatsapp: string;
    country: {
      name: string;
      currency_code: string;
      currency_name: string;
      rate_to_usd: string;
    };
    user: {
      full_name: string;
      description: string;
    };
  };
};

export default function ServiceDetailsContent() {
  const { id } = useParams<{ id: string }>();

  const [service, setService] = useState<ServiceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(service);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("معرف الإعلان غير صالح");
      return;
    }

    const abortController = new AbortController();

    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        if (!baseUrl) {
          throw new Error("VITE_BACKEND_URL is not configured");
        }

        const cleanBaseUrl = baseUrl.endsWith("/")
          ? baseUrl.slice(0, -1)
          : baseUrl;

        const response = await apiFetch(
          `${cleanBaseUrl}/announcements/${id}/`,
          {
            auth: false,
            signal: abortController.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = (await response.json()) as ServiceDetails;
        setService(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error ? err.message : "تعذر تحميل تفاصيل الإعلان",
        );
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchService();

    return () => {
      abortController.abort();
    };
  }, [id]);

  useMeta({
    title: service ? `حساباتي | ${service.title}` : "حساباتي | غير موجود",
    description: service?.description || "تفاصيل الإعلان غير متوفرة.",
  });

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-white">
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-accent" />
          <p className="text-gray-400">جاري تحميل تفاصيل الإعلان...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-white">
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-bold">الإعلان غير موجود</h1>
          <p className="text-gray-400">
            {error || "عذرًا، لم نتمكن من العثور على الإعلان المطلوب."}
          </p>
          <Link
            to="/"
            className="inline-block rounded-lg bg-accent px-6 py-3 font-bold text-black"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col bg-[#0e0e0e] px-4 py-8 sm:px-8">
      <div className="flex h-full w-full flex-1 flex-col">
        <Link
          to="/"
          className="group mb-8 inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
        >
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          <span>العودة للإعلانات</span>
        </Link>

        <div className="relative flex-1 overflow-hidden rounded-3xl border border-white/5 bg-[#141414] p-6 shadow-2xl sm:p-10">
          <div className="pointer-events-none absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

          <div className="relative z-10 space-y-10">
            <div className="flex! flex-col-reverse gap-8 lg:flex-row-reverse! lg:items-start! lg:gap-12">
              <div className="hidden items-center! justify-center! lg:flex! lg:w-1/3 lg:shrink-0">
                <div className="flex! size-96 items-center justify-center rounded-3xl border border-white/10 bg-black/20 text-accent">
                  {getPlatformIcon(service.category, "w-40 h-40")}
                </div>
              </div>

              <div className="flex-1 space-y-8 text-right">
                <div className="space-y-4">
                  <div
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-gray-300"
                    dir="ltr"
                  >
                    <span>{service.category}</span>
                    <span className="text-accent">
                      {getPlatformIcon(service.category, "w-4 h-4")}
                    </span>
                  </div>

                  <h1 className="text-3xl leading-tight font-bold text-white sm:text-4xl md:text-5xl">
                    {service.title}
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl bg-accent/10 px-5 py-3">
                    {/* السعر بالدولار */}
                    <span className="text-3xl font-bold text-accent" dir="ltr">
                      {service.price_original}{" "}
                      {service.seller.country.currency_code}
                    </span>

                    {/* سهم التحويل */}
                    <span className="text-white/50 text-lg">→</span>

                    {/* السعر بالعملة المحلية */}
                    <span
                      className="text-xl font-semibold text-white"
                      dir="ltr"
                    >
                      ${service.price_usd}
                    </span>
                  </div>
                </div>

                <div className="max-w-2xl space-y-4 rounded-2xl border border-white/5 bg-black/20 p-6 leading-relaxed text-gray-300">
                  <h3 className="mb-2 border-b border-white/10 pb-2 text-xl font-bold text-white">
                    وصف الحساب
                  </h3>

                  <p>{service.description}</p>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <span className="mb-1 block text-sm text-gray-500">
                        عدد المتابعين
                      </span>
                      <span className="text-lg font-bold font-mono">
                        {service.followers.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="mb-1 block text-sm text-gray-500">
                        سنة الإنشاء
                      </span>
                      <span className="text-lg font-bold font-mono">
                        {service.account_created_at}
                      </span>
                    </div>

                    <div>
                      <span className="mb-1 block text-sm text-gray-500">
                        حالة الحساب
                      </span>
                      <span
                        className={`inline-block rounded px-2 py-1 text-sm font-bold ${
                          service.status === "sold"
                            ? "bg-red-500/20 text-red-500"
                            : "bg-green-500/20 text-green-500"
                        }`}
                      >
                        {service.status === "sold" ? "مباع" : "متاح"}
                      </span>
                    </div>

                    <div>
                      <span className="mb-1 block text-sm text-gray-500">
                        رابط الحساب
                      </span>
                      <a
                        href={service.account_link}
                        target="_blank"
                        rel="noreferrer"
                        className="break-all font-bold text-accent hover:underline"
                        dir="ltr"
                      >
                        عرض الرابط
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full border-t border-white/10 pt-8">
              <h3 className="mb-6 text-right text-xl font-bold text-white">
                معلومات البائع
              </h3>

              <div className="flex w-full flex-col items-start gap-6 rounded-2xl border border-white/5 bg-black/20 p-6 sm:flex-row sm:items-center">
                <div className="flex-1 space-y-2 text-right">
                  <div className="text-lg font-bold text-white">
                    {service.seller.user.full_name}
                  </div>

                  <div className="text-sm text-gray-400">
                    {service.seller.user.description}
                  </div>

                  <div className="text-sm text-gray-500">
                    {service.seller.country.name}
                    {service.seller.country.currency_code
                      ? ` • ${service.seller.country.currency_code}`
                      : ""}
                  </div>
                </div>

                {service.status !== "sold" && (
                  <div className="flex w-full gap-3 sm:w-auto">
                    <Link
                      to={`https://wa.me/${service.seller.whatsapp.replace("+", "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-2.5 font-bold text-green-500 transition-all hover:bg-green-500 hover:text-white sm:flex-none"
                    >
                      <MessageCircle className="h-5 w-5" />
                      واتساب
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
