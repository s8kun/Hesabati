import useMeta from "../hooks/useMeta";
import ResetPasswordContent from "../components/AuthComponents/ResetPasswordContent";

export default function ResetPassword() {
  useMeta({
    title: "حساباتي | إعادة تعيين كلمة المرور",
    description: "قم بإعادة تعيين كلمة المرور الخاصة بحسابك.",
  });

  return <ResetPasswordContent />;
}
