import ProfileContent from "@/components/ProfileComponents/ProfileContent";
import useMeta from "@/hooks/useMeta";
export default function Profile() {
  useMeta({
    title: "حساباتي | الملف الشخصي",
    description:
      "ملفك الشخصي داخل منصة حساباتي مع الإعلانات والإعدادات وتحديث البيانات.",
  });

  return <ProfileContent />;
}
