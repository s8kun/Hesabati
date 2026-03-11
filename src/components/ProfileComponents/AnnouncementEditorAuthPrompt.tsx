import { ArrowRight, UserRound } from "lucide-react";
import { Link } from "react-router";

export default function AnnouncementEditorAuthPrompt() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#0e0e0e] px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/8 bg-[#141414] px-6 py-16 text-center shadow-2xl sm:px-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-accent/20 bg-accent/10 text-accent">
          <UserRound className="h-8 w-8" />
        </div>
        <h1 className="mb-3 text-3xl font-bold text-white">إدارة الإعلان</h1>
        <p className="mb-8 text-sm leading-8 text-gray-400 sm:text-base">
          لازم تسجل دخولك أولاً حتى تقدر تنشئ أو تعدّل إعلاناتك.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-2xl bg-accent px-6 py-3 font-bold text-black transition hover:bg-accent/90"
        >
          <ArrowRight className="h-5 w-5" />
          تسجيل الدخول
        </Link>
      </div>
    </div>
  );
}
