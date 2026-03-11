import { ArrowRight, FolderPlus } from "lucide-react";
import { Link } from "react-router";

type AnnouncementEditorHeaderProps = {
  isEditMode: boolean;
};

export default function AnnouncementEditorHeader({
  isEditMode,
}: AnnouncementEditorHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/6 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.14),_transparent_30%),linear-gradient(145deg,_rgba(23,23,23,0.98),_rgba(13,13,13,0.98))] px-6 py-8 shadow-2xl sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="max-w-2xl">
          <Link
            to="/profile"
            className="mb-5 lg:absolute right-0 inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
            العودة إلى الملف الشخصي
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
            <FolderPlus className="h-4 w-4" />
            {isEditMode ? "تعديل إعلان" : "إنشاء إعلان جديد"}
          </div>
          <h1 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
            {isEditMode ? "تحديث بيانات الإعلان" : "إضافة إعلان جديد"}
          </h1>
          <p className="mt-4 text-sm leading-8 text-gray-300 sm:text-base">
            عبّي بيانات الإعلان بشكل واضح ومرتب، وخلك مركز على المعلومات
            الأساسية اللي تهم المشتري من أول نظرة.
          </p>
        </div>
      </div>
    </section>
  );
}
