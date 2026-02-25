import useMeta from "../hooks/useMeta";
import ForgetPasswordContent from "../components/AuthComponents/ForgetPasswordContent";

export default function ForgetPassword() {
  useMeta({
    title: "حساباتي | نسيت كلمة المرور",
    description: "قم باستعادة كلمة المرور الخاصة بحسابك.",
  });

  return <ForgetPasswordContent />;
}
