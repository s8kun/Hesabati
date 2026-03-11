import { BriefcaseBusiness, MapPin, Phone, Sparkles } from "lucide-react";
import { maskPhone } from "./profile.utils";

type ProfileHeaderProps = {
  displayName: string;
  displayDescription: string;
  displayCountry: string;
  displayWhatsapp: string;
  profileInitials: string;
  announcementCount: number;
};

export default function ProfileHeader({
  displayName,
  displayDescription,
  displayCountry,
  displayWhatsapp,
  profileInitials,
  announcementCount,
}: ProfileHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/6 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.18),_transparent_32%),linear-gradient(145deg,_rgba(26,26,26,0.98),_rgba(15,15,15,0.98))] p-6 shadow-2xl sm:p-8">
      <div className="pointer-events-none absolute -top-28 -left-16 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative z-10 grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
            <Sparkles className="h-4 w-4" />
            الملف الشخصي والإعدادات
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/6 text-2xl font-black tracking-[0.2em] text-white">
              {profileInitials || "U"}
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                {displayName}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
                {displayDescription}
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5">
                  <MapPin className="h-4 w-4 text-accent" />
                  {displayCountry}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5">
                  <Phone className="h-4 w-4 text-accent" />
                  {maskPhone(displayWhatsapp)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between text-sm text-gray-400">
              <span>عدد الإعلانات</span>
              <BriefcaseBusiness className="h-4 w-4 text-accent" />
            </div>
            <div className="text-3xl font-bold text-white">
              {announcementCount}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
