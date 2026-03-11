import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, CheckSquare, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  getApiMessageInArabic,
  getErrorMessageInArabic,
  showErrorToast,
  showSuccessToast,
} from "@/lib/toast";
import { useUserStore } from "@/context/UserStore";
import { extractAuthTokens, setAuthTokens } from "@/lib/authCookies";
import { apiFetchJson } from "@/lib/apiFetch";

interface LoginInputs {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export default function LoginContent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  const [showPassword, setShowPassword] = useState(false);
  const navigator = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const onSubmit = async (data: LoginInputs) => {
    try {
      const { response, data: result } = await apiFetchJson<
        Record<string, unknown>
      >("/login/", {
        method: "POST",
        auth: false,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(
          getApiMessageInArabic(
            result,
            "تعذّر تسجيل الدخول، تحقق من البريد وكلمة المرور.",
          ),
        );
      }

      setAuthTokens(extractAuthTokens(result));
      setUser({
        fullName: typeof result.full_name === "string" ? result.full_name : "",
        email: typeof result.email === "string" ? result.email : data.email,
        country:
          typeof result.country === "string"
            ? result.country
            : typeof result.country_name === "string"
              ? result.country_name
              : "",
        whatsapp: typeof result.whatsapp === "string" ? result.whatsapp : "",
        description:
          typeof result.description === "string" ? result.description : "",
      });
      showSuccessToast(
        getApiMessageInArabic(result, "مرحبًا بعودتك، تم تسجيل الدخول بنجاح."),
      );
      navigator("/services");
    } catch (error: unknown) {
      showErrorToast(
        getErrorMessageInArabic(error, "حدث خطأ غير متوقع أثناء تسجيل الدخول."),
      );
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full bg-[#0e0e0e]">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative z-20">
        <div className="w-full max-w-md bg-[#141414] border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

          <form
            className="relative z-10 flex flex-col items-center justify-center w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full space-y-2 mb-5 text-right">
              <label className="text-sm font-semibold text-gray-300 tracking-wide">
                البريد الإلكتروني
              </label>
              <div
                className="flex items-center w-full bg-white/[0.04] border border-white/10 h-12 rounded-xl overflow-hidden px-4 gap-3 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all"
                dir="ltr"
              >
                <Mail className="w-5 h-5 text-gray-500 shrink-0" />
                <Input
                  type="email"
                  placeholder="example@email.com"
                  className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-600 outline-none w-full h-full text-left"
                  {...register("email", {
                    required: "البريد الإلكتروني مطلوب",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "البريد الإلكتروني غير صحيح",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="w-full space-y-2 mb-6 text-right">
              <label className="text-sm font-semibold text-gray-300 tracking-wide">
                كلمة المرور
              </label>
              <div
                className="flex items-center w-full bg-white/[0.04] border border-white/10 h-12 rounded-xl overflow-hidden px-4 gap-3 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all"
                dir="ltr"
              >
                <Lock className="w-5 h-5 text-gray-500 shrink-0" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-600 outline-none w-full h-full text-left tracking-widest"
                  {...register("password", {
                    required: "كلمة المرور مطلوبة",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-accent transition-colors focus:outline-none shrink-0"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="w-full flex justify-between items-center mb-8 gap-4 px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 rounded border border-white/20 bg-white/[0.04] group-hover:border-accent/50 transition-colors">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    {...register("rememberMe")}
                  />
                  <CheckSquare className="w-3.5 h-3.5 text-accent opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  تذكرني
                </span>
              </label>
              <Link
                to="/forget-password"
                className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl font-bold text-black bg-accent hover:bg-accent/90 transition-all flex items-center justify-center gap-2 mb-6"
              style={{ boxShadow: "0 0 20px rgba(212,175,55,0.25)" }}
            >
              تسجيل الدخول
              <ArrowRight className="w-5 h-5" />
            </button>
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
