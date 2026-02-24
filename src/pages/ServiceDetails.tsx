import { useParams, Link } from "react-router";
import { getServiceById } from "../data/services";
import { useExchangeRate } from "../context/ExchangeRateContext";
import { useFilters } from "../context/FilterContext";
import useMeta from "../hooks/useMeta";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function ServiceDetails() {
  const { id } = useParams<{ id: string }>();
  const service = getServiceById(Number(id));
  const { convertPrice } = useExchangeRate();
  const { filters } = useFilters();

  useMeta({
    title: service ? `حساباتي | ${service.title}` : "حساباتي | غير موجود",
    description: service?.description || "تفاصيل الإعلان غير متوفرة.",
  });

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] text-white">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold">الإعلان غير موجود</h1>
          <p className="text-gray-400">
            عذرًا، لم نتمكن من العثور على الإعلان المطلوب.
          </p>
          <Link
            to="/"
            className="inline-block bg-accent text-black px-6 py-3 rounded-lg font-bold"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  // Calculate the localized price based on the selected country filter
  const localPrice = convertPrice(service.price_usd, filters.country);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col w-full bg-[#0e0e0e] py-8 px-4 sm:px-8">
      <div className="w-full h-full flex flex-col flex-1">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span>العودة للإعلانات</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden flex-1">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

          {/* Right Section: Details */}
          <div className="flex-1 space-y-8 relative z-10 text-right order-2 lg:order-1">
            <div className="space-y-4">
              <div className="inline-block bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm font-medium text-gray-300">
                {service.platformName}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                {service.title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span
                className="text-accent text-4xl font-bold bg-accent/10 px-6 py-2 rounded-xl"
                dir="ltr"
              >
                {localPrice.amount.toFixed(2)} {localPrice.symbol}
              </span>
            </div>

            <div className="space-y-4 text-gray-300 leading-relaxed max-w-2xl bg-black/20 p-6 rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-2 border-b border-white/10 pb-2">
                وصف الحساب
              </h3>
              <p>{service.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <span className="block text-sm text-gray-500 mb-1">
                    عدد المتابعين
                  </span>
                  <span className="font-bold font-mono text-lg">
                    {service.followers.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="block text-sm text-gray-500 mb-1">
                    سنة الإنشاء
                  </span>
                  <span className="font-bold font-mono text-lg">
                    {service.account_created_at}
                  </span>
                </div>
                <div>
                  <span className="block text-sm text-gray-500 mb-1">
                    حالة الحساب
                  </span>
                  <span
                    className={`font-bold text-sm px-2 py-1 rounded inline-block ${service.status === "sold" ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"}`}
                  >
                    {service.status === "sold" ? "مباع" : "متاح"}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h3 className="text-xl font-bold text-white mb-6">
                معلومات البائع
              </h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-black/20 p-6 rounded-2xl border border-white/5">
                <div className="flex-1">
                  <div className="text-lg font-bold text-white mb-1">
                    {service.seller.user.full_name}
                  </div>
                  <div className="text-sm text-gray-400 font-mono" dir="ltr">
                    ID: #{service.seller.id}
                  </div>
                </div>
                {service.status !== "sold" && (
                  <div className="flex gap-3 w-full sm:w-auto">
                    <a
                      href={`https://wa.me/${service.seller.whatsapp.replace("+", "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white px-5 py-2.5 rounded-xl font-bold transition-all border border-green-500/20"
                    >
                      <MessageCircle className="w-5 h-5" />
                      واتساب
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Left Section: Large Icon */}
          <div className="w-full lg:w-1/3 flex items-center justify-center p-12 order-1 lg:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full" />
              <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 [&>svg]:w-full [&>svg]:h-full drop-shadow-2xl">
                {service.platformIcon}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
