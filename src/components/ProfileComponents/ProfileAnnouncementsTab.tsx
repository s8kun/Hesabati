import {
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Loader2,
  MessageCircle,
  Plus,
  Send,
  SquarePen,
  Trash2,
  Twitter,
  Youtube,
} from "lucide-react";
import { Link } from "react-router";
import type { AnnouncementItem } from "./profile.types";
import { formatCurrency, formatDate, getStatusLabel } from "./profile.utils";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
  </svg>
);

const getPlatformIcon = (platform: string, className = "h-5 w-5") => {
  const normalized = platform.toLowerCase();

  if (normalized.includes("instagram")) {
    return <Instagram className={className} />;
  }
  if (normalized.includes("youtube")) {
    return <Youtube className={className} />;
  }
  if (normalized.includes("facebook")) {
    return <Facebook className={className} />;
  }
  if (normalized.includes("twitter") || normalized.includes("x")) {
    return <Twitter className={className} />;
  }
  if (normalized.includes("tiktok")) {
    return <TikTokIcon className={className} />;
  }
  if (normalized.includes("telegram")) {
    return <Send className={className} />;
  }
  if (normalized.includes("whatsapp")) {
    return <MessageCircle className={className} />;
  }
  if (normalized.includes("linkedin")) {
    return <Linkedin className={className} />;
  }

  return <Globe className={className} />;
};

type ProfileAnnouncementsTabProps = {
  isLoading: boolean;
  announcements: AnnouncementItem[];
  announcementCount: number;
  deletingAnnouncementId: number | null;
  onDeleteRequest: (announcementId: number) => void;
};

export default function ProfileAnnouncementsTab({
  isLoading,
  announcements,
  announcementCount,
  deletingAnnouncementId,
  onDeleteRequest,
}: ProfileAnnouncementsTabProps) {
  return (
    <section className="rounded-[1.75rem] border border-white/6 bg-[#141414] p-6 shadow-2xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">إعلانات الحساب</h2>
          <p className="mt-2 text-sm text-gray-400">
            كل الإعلانات المرتبطة بالملف الحالي مع روابطها وتفاصيلها الأساسية.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/profile/announcements/new"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-bold text-black transition hover:bg-accent/90"
          >
            <Plus className="h-4 w-4" />
            إضافة إعلان
          </Link>
          <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-gray-300">
            الإجمالي: {announcementCount}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-80 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-accent" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-black/20 px-5 py-14 text-center text-gray-400">
          لا توجد إعلانات لعرضها في هذا الحساب حالياً.
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {announcements.map((announcement) => (
            <article
              key={announcement.id}
              className="overflow-hidden rounded-[1.75rem] border border-white/6 bg-[linear-gradient(160deg,_rgba(255,255,255,0.04),_rgba(0,0,0,0.18))] p-5 shadow-xl"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-[1.3rem] border border-accent/15 bg-accent/10 p-3 text-accent">
                    {getPlatformIcon(announcement.category, "h-6 w-6")}
                  </div>
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold text-white">
                        {announcement.title}
                      </h3>
                      <span className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-xs text-gray-300">
                        {announcement.category}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-7 text-gray-400">
                      {announcement.description}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    announcement.status === "sold"
                      ? "bg-red-500/15 text-red-300"
                      : "bg-emerald-500/15 text-emerald-300"
                  }`}
                >
                  {getStatusLabel(announcement.status)}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/6 bg-black/20 p-3">
                  <p className="mb-1 text-xs text-gray-500">السعر بالدولار</p>
                  <p className="font-bold text-accent" dir="ltr">
                    {formatCurrency(announcement.price_usd)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/6 bg-black/20 p-3">
                  <p className="mb-1 text-xs text-gray-500">عدد المتابعين</p>
                  <p className="font-bold text-white" dir="ltr">
                    {announcement.followers.toLocaleString("en-US")}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/6 bg-black/20 p-3">
                  <p className="mb-1 text-xs text-gray-500">تاريخ إنشاء الحساب</p>
                  <p className="font-bold text-white">
                    {formatDate(announcement.account_created_at)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/6 bg-black/20 p-3">
                  <p className="mb-1 text-xs text-gray-500">تاريخ نشر الإعلان</p>
                  <p className="font-bold text-white">
                    {formatDate(announcement.created_at)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={`/services/${announcement.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 font-bold text-black transition hover:bg-accent/90"
                >
                  <ExternalLink className="h-4 w-4" />
                  فتح الإعلان
                </Link>
                <Link
                  to={`/profile/announcements/${announcement.id}/edit`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 font-bold text-white transition hover:bg-white/10"
                >
                  <SquarePen className="h-4 w-4" />
                  تعديل
                </Link>
                <button
                  type="button"
                  onClick={() => onDeleteRequest(announcement.id)}
                  disabled={deletingAnnouncementId === announcement.id}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 font-bold text-red-200 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {deletingAnnouncementId === announcement.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  حذف
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
