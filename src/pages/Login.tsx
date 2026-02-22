import { Link } from "react-router";
import useMeta from "../hooks/useMeta";

export default function Login() {
  useMeta({
    title: "حساباتي | تسجيل الدخول",
    description:
      "قم بتسجيل الدخول إلى منصة حساباتي للاستفادة من جميع الخدمات المتاحة.",
  });

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full bg-[#0e0e0e]">
      {/* Right Side (Image in RTL) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative z-20">
        <div className="w-full max-w-md bg-[#141414] border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

          <form
            className="relative z-10 flex flex-col items-center justify-center w-full"
            onSubmit={(e) => e.preventDefault()}
          >
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              تسجيل الدخول
            </h2>
            <p className="text-sm text-gray-400 mb-8 text-center">
              مرحباً بك مجدداً! يرجى إدخال بيانات حسابك للمتابعة.
            </p>

            {/* Email Input */}
            <div className="w-full space-y-2 mb-5 text-right">
              <label className="text-sm font-semibold text-gray-300 tracking-wide">
                البريد الإلكتروني
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
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="bg-transparent text-white placeholder-gray-600 outline-none w-full h-full text-left"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="w-full space-y-2 mb-6 text-right">
              <label className="text-sm font-semibold text-gray-300 tracking-wide">
                كلمة المرور
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
                <input
                  type="password"
                  placeholder="********"
                  className="bg-transparent text-white placeholder-gray-600 outline-none w-full h-full text-left tracking-widest"
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="w-full flex justify-between items-center mb-8 gap-4 px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 rounded border border-white/20 bg-black/50 group-hover:border-accent/50 transition-colors">
                  <input type="checkbox" className="sr-only peer" />
                  <svg
                    className="w-3.5 h-3.5 text-accent opacity-0 peer-checked:opacity-100 transition-opacity"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  تذكرني
                </span>
              </label>

              <a
                href="#"
                className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
              >
                نسيت كلمة المرور؟
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 rounded-xl font-bold text-black bg-accent hover:bg-accent/90 transition-all flex items-center justify-center gap-2 mb-6"
              style={{ boxShadow: "0 0 20px rgba(212,175,55,0.25)" }}
            >
              تسجيل الدخول
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

            {/* Sign up link */}
            <p className="text-sm text-gray-400">
              ليس لديك حساب بعد؟{" "}
              <Link
                to="/register"
                className="font-bold text-white hover:text-accent transition-colors"
              >
                تسجيل جديد
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Left Side (Form in RTL) */}

      <div className="w-full lg:w-1/2 hidden lg:block relative p-4 pl-0">
        <div className="w-full h-full rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-l from-[#0e0e0e] to-transparent z-10" />
          <div className="absolute inset-0 bg-linear-to-t from-[#0e0e0e] via-transparent to-transparent z-10" />
          <img
            className="w-full h-full object-cover"
            src="/login-bg.png"
            alt="Login Background"
          />
          <div className="absolute inset-0 bg-accent/5 mix-blend-overlay z-0" />
        </div>
      </div>
    </div>
  );
}
