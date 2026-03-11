import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import {
  getApiMessageInArabic,
  getErrorMessageInArabic,
  showErrorToast,
  showSuccessToast,
} from "@/lib/toast";
import { useUserStore } from "@/context/UserStore";
import { extractAuthTokens, setAuthTokens } from "@/lib/authCookies";
import { apiFetchJson } from "@/lib/apiFetch";

export default function OTPContent() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (loading) return;

    const cleanValue = value.replace(/\D/g, "");

    // paste كامل
    if (cleanValue.length > 1) {
      const newOtp = [...otp];
      cleanValue
        .slice(0, 6)
        .split("")
        .forEach((char, i) => {
          if (index + i < 6) newOtp[index + i] = char;
        });

      setOtp(newOtp);

      const nextIndex = Math.min(index + cleanValue.length, 5);
      inputRefs.current[nextIndex]?.focus();

      if (newOtp.every((v) => v !== "")) {
        submitOtp(newOtp.join(""));
      }

      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);

    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((v) => v !== "")) {
      submitOtp(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const submitOtp = async (code: string) => {
    if (code.length !== 6) return;

    try {
      setLoading(true);

      const { response, data: result } = await apiFetchJson<
        Record<string, unknown>
      >("/verify_otp/", {
        method: "POST",
        auth: false,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: location.state?.email,
          code,
        }),
      });
      if (!response.ok) {
        throw new Error(
          getApiMessageInArabic(result, "رمز التحقق غير صحيح، حاول مرة أخرى."),
        );
      }

      setAuthTokens(extractAuthTokens(result));
      setUser({
        fullName: typeof result.full_name === "string" ? result.full_name : "",
        email:
          typeof result.email === "string"
            ? result.email
            : location.state?.email || "",
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
        getApiMessageInArabic(result, "تم تأكيد الرمز بنجاح، أهلًا بك معنا."),
      );
      navigate("/services", { replace: true });
    } catch (err: unknown) {
      showErrorToast(
        getErrorMessageInArabic(err, "حدث خطأ أثناء التحقق من الرمز."),
      );
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setLoading(true);

      const { response, data: result } = await apiFetchJson<
        Record<string, unknown>
      >("/verify_otp/", {
        method: "POST",
        auth: false,
        headers: {
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(
          getApiMessageInArabic(result, "تعذّر إعادة إرسال الرمز الآن."),
        );
      }

      showSuccessToast(
        getApiMessageInArabic(result, "تمت إعادة إرسال الرمز بنجاح."),
      );
    } catch (error: unknown) {
      showErrorToast(
        getErrorMessageInArabic(
          error,
          "تعذّرت إعادة إرسال الرمز، حاول بعد قليل.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0e0e0e] p-6">
      <div className="w-full max-w-md bg-[#141414] p-8 rounded-3xl shadow-2xl border border-white/5">
        <h2 className="text-3xl font-bold text-white text-center mb-3">
          تأكيد الرمز
        </h2>

        <p className="text-gray-400 text-center mb-8 text-sm">
          أدخل رمز التحقق المكون من 6 أرقام
        </p>

        <div className="flex justify-between gap-3 mb-6" dir="ltr">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={(e) => e.target.select()}
              disabled={loading}
              className="w-12 h-14 text-center text-2xl font-bold bg-white/[0.04] border border-white/10 rounded-xl text-accent focus:ring-1 focus:ring-accent outline-none"
            />
          ))}
        </div>

        <button
          disabled={otp.some((v) => v === "") || loading}
          onClick={() => submitOtp(otp.join(""))}
          className="w-full h-12 bg-accent text-black font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 mb-6"
        >
          {loading ? "جاري التحقق..." : "تأكيد"}
          <ArrowRight size={18} />
        </button>

        <div className="text-center space-y-3">
          <button
            onClick={resendOtp}
            disabled={loading}
            className="text-sm text-white hover:text-accent transition"
          >
            إعادة إرسال الرمز
          </button>

          <div>
            <Link
              to="/login"
              className="text-sm text-gray-500 hover:text-white"
            >
              العودة لتسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
