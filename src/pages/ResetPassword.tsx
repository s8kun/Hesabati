import { Link } from "react-router";
import useMeta from "../hooks/useMeta";
// تأكد من تعديل المسار التالي حسب هيكل مشروعك إذا لزم الأمر
import { Input } from "@/components/ui/input";

export default function ResetPassword() {
  useMeta({
    title: "حساباتي | إعادة تعيين كلمة المرور",
    description: "قم بإعادة تعيين كلمة المرور الخاصة بحسابك.",
  });

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] w-full bg-[#0e0e0e] p-4 sm:p-8 relative">
      <div className="w-full max-w-md bg-[#141414] border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden z-20">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <form
          className="relative z-10 flex flex-col items-center justify-center w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight text-center">
            إعادة تعيين كلمة المرور
          </h2>
          <p className="text-sm text-gray-400 mb-8 text-center leading-relaxed">
            يرجى إدخال كلمة المرور الجديدة وتأكيدها للمتابعة.
          </p>

          {/* Password Input */}
          <div className="w-full space-y-2 mb-5 text-right">
            <label className="text-sm font-semibold text-gray-300 tracking-wide">
              كلمة المرور الجديدة
            </label>
            <div
              className="flex items-center w-full bg-black/50 border border-white/10 h-12 rounded-xl overflow-hidden px-4 gap-3 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all"
              dir="ltr"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500 shrink-0"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <Input
                type="password"
                placeholder="********"
                className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-600 outline-none w-full h-full text-left tracking-widest px-0"
                required
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="w-full space-y-2 mb-8 text-right">
            <label className="text-sm font-semibold text-gray-300 tracking-wide">
              تأكيد كلمة المرور
            </label>
            <div
              className="flex items-center w-full bg-black/50 border border-white/10 h-12 rounded-xl overflow-hidden px-4 gap-3 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all"
              dir="ltr"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500 shrink-0"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <Input
                type="password"
                placeholder="********"
                className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-600 outline-none w-full h-full text-left tracking-widest px-0"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-12 rounded-xl font-bold text-black bg-accent hover:bg-accent/90 transition-all shadow-lg flex items-center justify-center gap-2 mb-6"
            style={{ boxShadow: "0 0 20px rgba(212,175,55,0.25)" }}
          >
            حفظ التغييرات
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="rotate-180"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>

          {/* Back to Login link */}
          <p className="text-sm text-gray-400">
            <Link
              to="/login"
              className="font-bold text-white hover:text-accent transition-colors"
            >
              العودة لتسجيل الدخول
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
