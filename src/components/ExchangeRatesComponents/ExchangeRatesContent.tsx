import { useExchangeRate } from "../../context/ExchangeRateContext";
import { ArrowLeftRight, TrendingUp } from "lucide-react";

export default function ExchangeRatesContent() {
  const { supportedRates, title, description, isLoading, error } =
    useExchangeRate();

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full bg-[#0e0e0e] justify-center pt-8 p-4">
      <div className="w-full max-w-4xl relative z-20 space-y-8">
        {/* Header Section */}
        <div className="bg-[#141414] border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-right flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight flex items-center justify-end gap-3">
                <ArrowLeftRight className="w-8 h-8 text-accent" />
                {title}
              </h1>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Rates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {isLoading && supportedRates.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 text-center text-gray-400 py-12 bg-[#141414] border border-white/10 rounded-2xl">
              جاري تحميل أسعار الصرف...
            </div>
          )}

          {!isLoading && error && supportedRates.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 text-center text-red-400 py-12 bg-[#141414] border border-red-500/20 rounded-2xl">
              تعذر تحميل أسعار الصرف: {error}
            </div>
          )}

          {!isLoading && !error && supportedRates.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 text-center text-gray-400 py-12 bg-[#141414] border border-white/10 rounded-2xl">
              لا توجد أسعار صرف متاحة حالياً.
            </div>
          )}

          {supportedRates.map((rateData) => {
            return (
              <div
                key={rateData.pair}
                className="bg-[#141414] border border-white/10 hover:border-accent/50 rounded-2xl p-6 transition-all duration-300 flex flex-col relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div
                  className="flex justify-between items-center mb-4 relative z-10 w-full"
                  dir="ltr"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white tracking-widest bg-white/10 px-3 py-1 rounded-md">
                      {rateData.usdAmount}
                    </span>
                  </div>
                  <ArrowLeftRight className="w-5 h-5 text-gray-500" />
                  <div className="flex items-center gap-2 text-right">
                    <span className="text-xl font-bold text-accent tracking-widest bg-accent/10 px-3 py-1 rounded-md">
                      {rateData.localAmount}
                    </span>
                  </div>
                </div>

                <div
                  className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-white/5"
                  dir="rtl"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span>{rateData.label}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    {rateData.pair}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
