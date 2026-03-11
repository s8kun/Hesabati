import { Link } from "react-router";
import { ArrowRight, Home } from "lucide-react";
import useMeta from "@/hooks/useMeta";

export default function NotFound() {
  useMeta({
    title: "حساباتي | الصفحة غير موجودة",
    description: "الصفحة التي تحاول الوصول إليها غير متوفرة أو تم نقلها.",
  });

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-[#0e0e0e] px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-white/8 bg-[#141414] p-8 text-center shadow-2xl sm:p-12">
        <div className="mb-5 text-6xl font-extrabold tracking-tight text-accent sm:text-7xl">
          404
        </div>

        <h1 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
          الصفحة غير موجودة
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
          عذرا، الرابط الذي قمت بفتحه غير صحيح أو الصفحة تم حذفها. يمكنك الرجوع
          الى صفحة الخدمات والمتابعة من هناك.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/services"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-bold text-black transition hover:bg-accent/90 sm:w-auto"
          >
            <Home className="h-5 w-5" />
            الذهاب الى الخدمات
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-semibold text-gray-200 transition hover:bg-white/5 sm:w-auto"
          >
            <ArrowRight className="h-5 w-5" />
            رجوع
          </button>
        </div>
      </div>
    </div>
  );
}
