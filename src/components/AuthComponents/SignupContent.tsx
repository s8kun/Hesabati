import { useState } from "react";
import { Link } from "react-router";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface SignupInputs {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupContent() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupInputs>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (data: SignupInputs) => {
    console.log(data);
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full bg-[#0e0e0e]">
      {/* Right Side (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative z-20">
        <div className="w-full max-w-md bg-[#141414] border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

          <form
            className="relative z-10 flex flex-col items-center justify-center w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              إنشاء حساب جديد
            </h2>
            <p className="text-sm text-gray-400 mb-8 text-center leading-relaxed">
              انضم إلينا الآن للوصول إلى آلاف الحسابات الجاهزة!
            </p>

            {/* Full Name Input */}
            <div className="w-full space-y-2 mb-5 text-right">
              <label className="text-sm font-semibold text-gray-300 tracking-wide">
                الاسم الكامل
              </label>
              <div
                className="flex items-center w-full bg-black/50 border border-white/10 h-12 rounded-xl overflow-hidden px-4 gap-3 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all"
                dir="ltr"
              >
                <User className="w-5 h-5 text-gray-500 shrink-0" />
                <Input
                  type="text"
                  placeholder="Ali Ahmed"
                  className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-600 outline-none w-full h-full text-left"
                  {...register("fullName", { required: "الاسم الكامل مطلوب" })}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="w-full space-y-2 mb-5 text-right">
              <label className="text-sm font-semibold text-gray-300 tracking-wide">
                البريد الإلكتروني
              </label>
              <div
                className="flex items-center w-full bg-black/50 border border-white/10 h-12 rounded-xl overflow-hidden px-4 gap-3 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all"
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

            {/* Password Input */}
            <div className="w-full space-y-2 mb-5 text-right">
              <label className="text-sm font-semibold text-gray-300 tracking-wide">
                كلمة المرور
              </label>
              <div
                className="flex items-center w-full bg-black/50 border border-white/10 h-12 rounded-xl overflow-hidden px-4 gap-3 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all"
                dir="ltr"
              >
                <Lock className="w-5 h-5 text-gray-500 shrink-0" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-600 outline-none w-full h-full text-left tracking-widest"
                  {...register("password", {
                    required: "كلمة المرور مطلوبة",
                    minLength: {
                      value: 6,
                      message: "يجب أن تكون 6 أحرف على الأقل",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-accent focus:outline-none shrink-0"
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

            {/* Confirm Password Input */}
            <div className="w-full space-y-2 mb-8 text-right">
              <label className="text-sm font-semibold text-gray-300 tracking-wide">
                تأكيد كلمة المرور
              </label>
              <div
                className="flex items-center w-full bg-black/50 border border-white/10 h-12 rounded-xl overflow-hidden px-4 gap-3 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all"
                dir="ltr"
              >
                <Lock className="w-5 h-5 text-gray-500 shrink-0" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-600 outline-none w-full h-full text-left tracking-widest"
                  {...register("confirmPassword", {
                    required: "تأكيد كلمة المرور مطلوب",
                    validate: (value) =>
                      value === watch("password") ||
                      "كلمتا المرور غير متطابقتين",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-500 hover:text-accent focus:outline-none shrink-0"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 rounded-xl font-bold text-black bg-accent hover:bg-accent/90 transition-all shadow-lg flex items-center justify-center gap-2 mb-6"
              style={{ boxShadow: "0 0 20px rgba(212,175,55,0.25)" }}
            >
              تسجيل حساب جديد
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Sign in link */}
            <p className="text-sm text-gray-400">
              أتمتلك حساباً بالفعل؟{" "}
              <Link
                to="/login"
                className="font-bold text-white hover:text-accent transition-colors"
              >
                تسجيل الدخول
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Left Side (Image) */}
      <div className="w-full lg:w-1/2 hidden lg:block relative p-4 pl-0">
        <div className="w-full h-full rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-l from-[#0e0e0e] to-transparent z-10" />
          <div className="absolute inset-0 bg-linear-to-t from-[#0e0e0e] via-transparent to-transparent z-10" />
          <img
            className="w-full h-full object-cover"
            src="/login-bg.png"
            alt="Signup Background"
          />
          <div className="absolute inset-0 bg-accent/5 mix-blend-overlay z-0" />
        </div>
      </div>
    </div>
  );
}
