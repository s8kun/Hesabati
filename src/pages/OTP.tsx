import useMeta from "../hooks/useMeta";
import OTPContent from "../components/AuthComponents/OTPContent";

export default function OTP() {
  useMeta({
    title: "حساباتي | تأكيد الرمز",
    description: "أدخل رمز التحقق الذي تم إرساله إلى بريدك الإلكتروني.",
  });

  return <OTPContent />;
}
