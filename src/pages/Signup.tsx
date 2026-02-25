import useMeta from "../hooks/useMeta";
import SignupContent from "../components/AuthComponents/SignupContent";

export default function Signup() {
  useMeta({
    title: "حساباتي | إنشاء حساب",
    description: "أنشئ حسابك الجديد في حساباتي للاستفادة من جميع الميزات.",
  });

  return <SignupContent />;
}
