import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import useMeta from "../hooks/useMeta";

export default function OTP() {
  useMeta({
    title: "حساباتي | تأكيد الرمز",
    description: "أدخل رمز التحقق الذي تم إرساله إلى بريدك الإلكتروني.",
  });

  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    // 1. معالجة حالة اللصق (Paste) أو اقتراح الموبايل لرمز كامل
    if (value.length > 2) {
      const pastedData = value.replace(/\D/g, "").slice(0, 6).split("");
      if (pastedData.length === 0) return;

      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);

      // نقل التركيز لآخر خانة فارغة
      const nextIndex = Math.min(index + pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();

      // إرسال تلقائي إذا اكتملت الخانات
      if (newOtp.every((v) => v !== "")) {
        setTimeout(() => handleSubmit(newOtp.join("")), 150);
      }
      return;
    }

    // 2. معالجة الإدخال العادي (نأخذ آخر حرف فقط حتى لو حاول المستخدم الكتابة فوق رقم موجود)
    const digit = value.slice(-1);
    if (digit !== "" && isNaN(Number(digit))) return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit !== "") {
      // نقل التركيز للخانة التالية
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else {
        // إذا كانت الخانة الأخيرة، نقوم بإخفاء الكيبورد في الموبايل
        inputRefs.current[index]?.blur();
      }

      // 3. إرسال تلقائي بمجرد امتلاء كل الخانات (بدون شرط index === 5)
      if (newOtp.every((v) => v !== "")) {
        // استخدمنا setTimeout لكي يتمكن المستخدم من رؤية الرقم الأخير الذي أدخله قبل الانتقال
        setTimeout(() => {
          handleSubmit(newOtp.join(""));
        }, 150);
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (code: string) => {
    console.log("Auto-submitting OTP:", code);
    navigate("/reset-password");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] w-full bg-[#0e0e0e] p-4 sm:p-8 relative">
      <div className="w-full max-w-lg bg-[#141414] border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden z-20">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <form
          className="relative z-10 flex flex-col items-center justify-center w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(otp.join(""));
          }}
        >
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight text-center">
            تأكيد الرمز
          </h2>

          <p className="text-sm text-gray-400 mb-8 text-center leading-relaxed">
            لقد أرسلنا رمز تحقق مكون من 6 أرقام إلى بريدك الإلكتروني. الرجاء
            إدخاله أدناه.
          </p>

          {/* OTP Input Boxes */}
          <div className="w-full mb-8 text-right" dir="ltr">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  // 4. جعلنا maxLength=6 لكي يقبل الموبايل لصق الـ 6 أرقام مرة واحدة عند اقتراحها
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  // 5. يسهل تغيير الرقم عند النقر عليه بدلاً من مسحه أولاً
                  onFocus={(e) => e.target.select()}
                  className="w-12 h-14 sm:w-14 sm:h-16 bg-black/50 border border-white/10 rounded-xl text-center text-xl sm:text-2xl font-mono text-accent font-bold focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none"
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={otp.some((v) => v === "")}
            className="w-full h-12 rounded-xl font-bold text-black bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-all shadow-lg flex items-center justify-center gap-2 mb-6"
            style={{ boxShadow: "0 0 20px rgba(212,175,55,0.25)" }}
          >
            تأكيد
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Resend & Back Links */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-gray-400">
              لم تستلم الرمز؟{" "}
              <button
                type="button"
                className="font-bold text-white hover:text-accent transition-colors"
                onClick={() => console.log("Resend OTP")}
              >
                إعادة إرسال
              </button>
            </p>

            <Link
              to="/login"
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              العودة لتسجيل الدخول
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
