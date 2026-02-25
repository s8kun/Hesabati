import useMeta from "../hooks/useMeta";
import LoginContent from "../components/AuthComponents/LoginContent";

export default function Login() {
  useMeta({
    title: "حساباتي | تسجيل الدخول",
    description:
      "قم بتسجيل الدخول إلى منصة حساباتي للاستفادة من جميع الخدمات المتاحة.",
  });

  return <LoginContent />;
}
