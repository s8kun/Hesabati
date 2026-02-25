import { Link, useNavigate } from "react-router";
import { Mail, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

// 1. تحديد نوع حقل الإدخال
interface ForgetPasswordInputs {
  email: string;
}

export default function ForgetPasswordContent() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordInputs>();

  const onSubmit = (data: ForgetPasswordInputs) => {
    console.log("استعادة كلمة المرور للبريد:", data.email);
    // هنا يمكن إضافة منطق إرسال الكود للبريد الإلكتروني
    // وبعد النجاح نوجه المستخدم لصفحة الـ OTP أو ما شابه
    navigate("/otp");
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
            نسيت كلمة المرور؟
          </h2>

          <p className="text-sm text-gray-400 mb-8 text-center leading-relaxed">
            لا تقلق، أدخل بريدك الإلكتروني وسنرسل لك رمزاً لإعادة تعيين كلمة
            المرور الخاصة بك.
          </p>

          {/* Email Input */}
          <div className="w-full space-y-2 mb-8 text-right">
            <label className="text-sm font-semibold text-gray-300 tracking-wide">
              البريد الإلكتروني
            </label>
            <div
              className={`flex items-center w-full bg-black/50 border ${
                errors.email ? "border-red-500/50" : "border-white/10"
              } h-12 rounded-xl overflow-hidden px-4 gap-3 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all`}
              dir="ltr"
            >
              <Mail className="w-5 h-5 text-gray-500 shrink-0" />
              <Input
                type="email"
                placeholder="example@mail.com"
                className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-600 outline-none w-full h-full text-left tracking-widest px-0"
                {...register("email", {
                  required: "البريد الإلكتروني مطلوب",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "البريد الإلكتروني غير صحيح",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-12 rounded-xl font-bold text-black bg-accent hover:bg-accent/90 transition-all shadow-lg flex items-center justify-center gap-2 mb-6"
            style={{ boxShadow: "0 0 20px rgba(212,175,55,0.25)" }}
          >
            إرسال رمز التحقق
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Back to Login link */}
          <p className="text-sm text-gray-400">
            تذكرت كلمة المرور؟{" "}
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
  );
}
