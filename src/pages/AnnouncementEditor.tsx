import AnnouncementEditorContent from "@/components/ProfileComponents/AnnouncementEditorContent";
import useMeta from "@/hooks/useMeta";

export default function AnnouncementEditor() {
  useMeta({
    title: "حساباتي | إدارة الإعلان",
    description:
      "إنشاء إعلان جديد أو تعديل إعلان موجود داخل لوحة البائع في حساباتي.",
  });

  return <AnnouncementEditorContent />;
}
