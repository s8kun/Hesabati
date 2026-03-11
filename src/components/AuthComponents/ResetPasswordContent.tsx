import { Link } from "react-router";
import { Lock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { showInfoToast } from "@/lib/toast";

// 1. إنشاء واجهة (Interface) لتحديد أنواع حقول النموذج
interface ResetPasswordInputs {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordContent() {
  const {
    register,
    handleSubmit,
    watch, // نحتاجه لمقارنة كلمتي المرور
    formState: { errors },
  } = useForm<ResetPasswordInputs>(); // 2. تمرير الواجهة هنا

  const onSubmit = () => {
    showInfoToast("تم التحقق من البيانات بنجاح. خطوة حفظ كلمة المرور النهائية قيد الربط الآن.");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] w-full bg-[#0e0e0e] p-4 sm:p-8 relative">
      <div className="w-full max-w-md bg-[#141414] border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden z-20">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <form
          className="relative z-10 flex flex-col items-center justify-center w-full"
          onSubmit={handleSubmit(onSubmit)}
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
              className="flex items-center w-full bg-white/[0.04] border border-white/10 h-12 rounded-xl overflow-hidden px-4 gap-3 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all"
              dir="ltr"
            >
              <Lock className="w-5 h-5 text-gray-500 shrink-0" />
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-600 outline-none w-full h-full text-left tracking-widest px-0"
                {...register("password", {
                  required: "كلمة المرور مطلوبة",
                  minLength: {
                    value: 6,
                    message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
                  },
                })}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="w-full space-y-2 mb-8 text-right">
            <label className="text-sm font-semibold text-gray-300 tracking-wide">
              تأكيد كلمة المرور
            </label>
            <div
              className="flex items-center w-full bg-white/[0.04] border border-white/10 h-12 rounded-xl overflow-hidden px-4 gap-3 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all"
              dir="ltr"
            >
              <Lock className="w-5 h-5 text-gray-500 shrink-0" />
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-600 outline-none w-full h-full text-left tracking-widest px-0"
                {...register("confirmPassword", {
                  required: "تأكيد كلمة المرور مطلوب",
                  // إضافة ميزة التحقق من تطابق كلمة المرور الجديدة
                  validate: (value) =>
                    value === watch("password") || "كلمتا المرور غير متطابقتين",
                })}
              />
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
            حفظ التغييرات
            <ArrowRight className="w-5 h-5" />
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
