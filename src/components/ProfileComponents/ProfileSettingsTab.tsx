import { BriefcaseBusiness, Loader2, Lock, Phone, Save, UserRound, Wallet } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { PasswordFormValues, ProfileFormValues } from "./profile.types";
import { maskPhone } from "./profile.utils";

type ProfileSettingsTabProps = {
  displayCountry: string;
  displayWhatsapp: string;
  isSavingProfile: boolean;
  isChangingPassword: boolean;
  nextPassword: string;
  profileForm: UseFormReturn<ProfileFormValues>;
  passwordForm: UseFormReturn<PasswordFormValues>;
  announcementCount: number;
  onSubmitProfile: React.FormEventHandler<HTMLFormElement>;
  onSubmitPassword: React.FormEventHandler<HTMLFormElement>;
};

export default function ProfileSettingsTab({
  displayCountry,
  displayWhatsapp,
  isSavingProfile,
  isChangingPassword,
  nextPassword,
  profileForm,
  passwordForm,
  announcementCount,
  onSubmitProfile,
  onSubmitPassword,
}: ProfileSettingsTabProps) {
  const {
    register: registerProfile,
    formState: { errors: profileErrors },
  } = profileForm;
  const {
    register: registerPassword,
    formState: { errors: passwordErrors },
  } = passwordForm;

  return (
    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[1.75rem] border border-white/6 bg-[#141414] p-6 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl border border-accent/15 bg-accent/10 p-3 text-accent">
            <Save className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">تعديل البيانات الشخصية</h2>
            <p className="mt-1 text-sm text-gray-400">
              هذا القسم داخل البروفايل مخصص لتعديل بياناتك الأساسية.
            </p>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.25rem] border border-white/6 bg-black/20 p-4">
            <p className="mb-2 text-sm text-gray-500">الدولة</p>
            <p className="font-bold text-white">{displayCountry}</p>
          </div>
          <div className="rounded-[1.25rem] border border-white/6 bg-black/20 p-4">
            <p className="mb-2 text-sm text-gray-500">رقم واتساب</p>
            <p className="font-bold text-white">{maskPhone(displayWhatsapp)}</p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={onSubmitProfile}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">
              الاسم الكامل
            </label>
            <div className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 transition focus-within:border-accent focus-within:ring-1 focus-within:ring-accent">
              <UserRound className="h-5 w-5 shrink-0 text-gray-500" />
              <Input
                type="text"
                placeholder="اكتب اسمك الكامل"
                className="h-full border-0 bg-transparent px-0 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                {...registerProfile("full_name", {
                  required: "الاسم الكامل مطلوب",
                  minLength: {
                    value: 2,
                    message: "الاسم قصير جدًا",
                  },
                })}
              />
            </div>
            {profileErrors.full_name ? (
              <p className="text-sm text-red-400">
                {profileErrors.full_name.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">
              رقم واتساب
            </label>
            <div
              className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 transition focus-within:border-accent focus-within:ring-1 focus-within:ring-accent"
              dir="ltr"
            >
              <Phone className="h-5 w-5 shrink-0 text-gray-500" />
              <Input
                type="tel"
                placeholder="213555000001"
                className="h-full border-0 bg-transparent px-0 text-left text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                {...registerProfile("whatsapp", {
                  required: "رقم واتساب مطلوب",
                  minLength: {
                    value: 8,
                    message: "رقم واتساب غير صالح",
                  },
                })}
              />
            </div>
            {profileErrors.whatsapp ? (
              <p className="text-sm text-red-400">
                {profileErrors.whatsapp.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">
              الوصف الشخصي
            </label>
            <textarea
              rows={5}
              placeholder="اكتب وصفًا مختصرًا عنك أو عن نشاطك."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-gray-600 focus:border-accent focus:ring-1 focus:ring-accent"
              {...registerProfile("description", {
                required: "الوصف مطلوب",
                minLength: {
                  value: 3,
                  message: "الوصف قصير جدًا",
                },
              })}
            />
            {profileErrors.description ? (
              <p className="text-sm text-red-400">
                {profileErrors.description.message}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSavingProfile}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 font-bold text-black transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSavingProfile ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                جاري حفظ التعديلات...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                حفظ التغييرات
              </>
            )}
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="rounded-[1.75rem] border border-white/6 bg-[#141414] p-6 shadow-2xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl border border-accent/15 bg-accent/10 p-3 text-accent">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">تغيير كلمة المرور</h2>
              <p className="mt-1 text-sm text-gray-400">
                أدخل كلمة المرور الحالية ثم الجديدة مع التأكيد.
              </p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={onSubmitPassword}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">
                كلمة المرور الحالية
              </label>
              <div
                className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 transition focus-within:border-accent focus-within:ring-1 focus-within:ring-accent"
                dir="ltr"
              >
                <Lock className="h-5 w-5 shrink-0 text-gray-500" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-full border-0 bg-transparent px-0 text-left text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...registerPassword("old_password", {
                    required: "كلمة المرور الحالية مطلوبة",
                  })}
                />
              </div>
              {passwordErrors.old_password ? (
                <p className="text-sm text-red-400">
                  {passwordErrors.old_password.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">
                كلمة المرور الجديدة
              </label>
              <div
                className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 transition focus-within:border-accent focus-within:ring-1 focus-within:ring-accent"
                dir="ltr"
              >
                <Lock className="h-5 w-5 shrink-0 text-gray-500" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-full border-0 bg-transparent px-0 text-left text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...registerPassword("new_password", {
                    required: "كلمة المرور الجديدة مطلوبة",
                    minLength: {
                      value: 6,
                      message: "كلمة المرور الجديدة قصيرة جدًا",
                    },
                  })}
                />
              </div>
              {passwordErrors.new_password ? (
                <p className="text-sm text-red-400">
                  {passwordErrors.new_password.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">
                تأكيد كلمة المرور الجديدة
              </label>
              <div
                className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 transition focus-within:border-accent focus-within:ring-1 focus-within:ring-accent"
                dir="ltr"
              >
                <Lock className="h-5 w-5 shrink-0 text-gray-500" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-full border-0 bg-transparent px-0 text-left text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...registerPassword("confirm_new_password", {
                    required: "تأكيد كلمة المرور الجديدة مطلوب",
                    validate: (value) =>
                      value === nextPassword || "تأكيد كلمة المرور غير مطابق",
                  })}
                />
              </div>
              {passwordErrors.confirm_new_password ? (
                <p className="text-sm text-red-400">
                  {passwordErrors.confirm_new_password.message}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-5 py-3 font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري تحديث كلمة المرور...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  تغيير كلمة المرور
                </>
              )}
            </button>
          </form>
        </div>

        <div className="rounded-[1.75rem] border border-white/6 bg-[#141414] p-6 shadow-2xl">
          <h3 className="mb-4 text-lg font-bold text-white">ملخص الحساب</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-white/6 bg-black/20 px-4 py-3 text-sm">
              <span className="flex items-center gap-2 text-gray-400">
                <Wallet className="h-4 w-4 text-accent" />
                الدولة
              </span>
              <span className="font-semibold text-white">{displayCountry}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/6 bg-black/20 px-4 py-3 text-sm">
              <span className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4 text-accent" />
                واتساب
              </span>
              <span className="font-semibold text-white" dir="ltr">
                {maskPhone(displayWhatsapp)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/6 bg-black/20 px-4 py-3 text-sm">
              <span className="flex items-center gap-2 text-gray-400">
                <BriefcaseBusiness className="h-4 w-4 text-accent" />
                الإعلانات
              </span>
              <span className="font-semibold text-white">{announcementCount}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
