import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { ArrowRight, CircleAlert, UserRound } from "lucide-react";
import { useUserStore } from "@/context/UserStore";
import {
  getApiMessageInArabic,
  getErrorMessageInArabic,
  showErrorToast,
  showSuccessToast,
} from "@/lib/toast";
import { apiFetchJson } from "@/lib/apiFetch";
import ProfileAnnouncementsTab from "./ProfileAnnouncementsTab";
import ProfileDeleteDialog from "./ProfileDeleteDialog";
import ProfileHeader from "./ProfileHeader";
import ProfileSettingsTab from "./ProfileSettingsTab";
import ProfileTabs from "./ProfileTabs";
import type {
  PasswordFormValues,
  ProfileFormValues,
  ProfileTab,
  SellerAnnouncementsResponse,
} from "./profile.types";

export default function ProfileContent() {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token as string | undefined;
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const patchUser = useUserStore((state) => state.patchUser);

  const [activeTab, setActiveTab] = useState<ProfileTab>("announcements");
  const [profileData, setProfileData] =
    useState<SellerAnnouncementsResponse | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(Boolean(token));
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [deletingAnnouncementId, setDeletingAnnouncementId] = useState<
    number | null
  >(null);
  const [pendingDeleteAnnouncementId, setPendingDeleteAnnouncementId] =
    useState<number | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    defaultValues: {
      full_name: user?.fullName || "",
      description: user?.description || "",
      whatsapp: user?.whatsapp || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  const nextPassword = passwordForm.watch("new_password");

  useEffect(() => {
    if (!token) {
      setIsLoadingProfile(false);
      setProfileData(null);
      setProfileError(null);
      profileForm.reset({
        full_name: user?.fullName || "",
        description: user?.description || "",
        whatsapp: user?.whatsapp || "",
      });
      return;
    }

    const abortController = new AbortController();

    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        setProfileError(null);

        const { response, data: result } = await apiFetchJson<
          SellerAnnouncementsResponse | Record<string, unknown>
        >("/seller/announcements/", {
          signal: abortController.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            getApiMessageInArabic(
              result,
              "تعذّر تحميل بيانات الملف الشخصي في الوقت الحالي.",
            ),
          );
        }

        const data = result as SellerAnnouncementsResponse;
        setProfileData(data);
        profileForm.reset({
          full_name: data.seller_profile.user.full_name || "",
          description: data.seller_profile.description || "",
          whatsapp: data.seller_profile.whatsapp || "",
        });
        setUser({
          fullName: data.seller_profile.user.full_name || "",
          email: data.seller_profile.user.email || "",
          country: data.seller_profile.country.name || "",
          whatsapp: data.seller_profile.whatsapp || "",
          description: data.seller_profile.description || "",
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setProfileError(
          getErrorMessageInArabic(
            error,
            "تعذّر تحميل بيانات الملف الشخصي في الوقت الحالي.",
          ),
        );
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoadingProfile(false);
        }
      }
    };

    fetchProfile();

    return () => {
      abortController.abort();
    };
  }, [cookies, profileForm, setUser, token, user?.description, user?.fullName, user?.whatsapp]);

  const sellerProfile = profileData?.seller_profile;
  const announcements = profileData?.announcements_data.results || [];
  const displayName =
    sellerProfile?.user.full_name || user?.fullName || "مستخدم";
  const displayCountry =
    sellerProfile?.country.name || user?.country || "غير محددة";
  const displayWhatsapp =
    sellerProfile?.whatsapp || user?.whatsapp || "غير متوفر";
  const displayDescription =
    sellerProfile?.description || user?.description || "لا يوجد وصف حتى الآن.";
  const profileInitials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const announcementCount = profileData?.announcements_data.count || 0;

  const onSubmitProfile = profileForm.handleSubmit(async (values) => {
    if (!token) {
      showErrorToast("لازم تسجل دخولك قبل تعديل بياناتك.");
      return;
    }

    try {
      setIsSavingProfile(true);

      const { response, data: result } = await apiFetchJson<
        Record<string, unknown>
      >("/seller/edit_profile/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          full_name: values.full_name.trim(),
          description: values.description.trim(),
          whatsapp: values.whatsapp.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(
          getApiMessageInArabic(
            result,
            "تعذّر تحديث بيانات الملف الشخصي، حاول مرة أخرى.",
          ),
        );
      }

      const responseData = result as {
        data?: {
          full_name?: string;
          description?: string;
          whatsapp?: string;
        };
      };

      const nextFullName =
        responseData.data?.full_name || values.full_name.trim();
      const nextDescription =
        responseData.data?.description || values.description.trim();
      const nextWhatsapp =
        responseData.data?.whatsapp || values.whatsapp.trim();

      patchUser({
        fullName: nextFullName,
        whatsapp: nextWhatsapp,
        description: nextDescription,
      });

      setProfileData((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          seller_profile: {
            ...current.seller_profile,
            user: {
              ...current.seller_profile.user,
              full_name: nextFullName,
            },
            description: nextDescription,
            whatsapp: nextWhatsapp,
          },
          announcements_data: {
            ...current.announcements_data,
            results: current.announcements_data.results.map((announcement) => ({
              ...announcement,
              seller: {
                ...announcement.seller,
                user: announcement.seller.user
                  ? {
                      ...announcement.seller.user,
                      full_name: nextFullName,
                    }
                  : announcement.seller.user,
                description: nextDescription,
                whatsapp: nextWhatsapp,
              },
            })),
          },
        };
      });

      showSuccessToast(
        getApiMessageInArabic(result, "تم تحديث بيانات الملف الشخصي بنجاح."),
      );
    } catch (error) {
      showErrorToast(
        getErrorMessageInArabic(
          error,
          "حدث خطأ أثناء تحديث بيانات الملف الشخصي.",
        ),
      );
    } finally {
      setIsSavingProfile(false);
    }
  });

  const onSubmitPassword = passwordForm.handleSubmit(async (values) => {
    if (!token) {
      showErrorToast("لازم تسجل دخولك قبل تغيير كلمة المرور.");
      return;
    }

    try {
      setIsChangingPassword(true);

      const { response, data: result } = await apiFetchJson<
        Record<string, unknown>
      >("/change-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          old_password: values.old_password,
          new_password: values.new_password,
        }),
      });

      if (!response.ok) {
        throw new Error(
          getApiMessageInArabic(
            result,
            "تعذّر تغيير كلمة المرور، تحقق من البيانات ثم حاول مجددًا.",
          ),
        );
      }

      passwordForm.reset();
      showSuccessToast(
        getApiMessageInArabic(result, "تم تحديث كلمة المرور بنجاح."),
      );
    } catch (error) {
      showErrorToast(
        getErrorMessageInArabic(error, "حدث خطأ أثناء تغيير كلمة المرور."),
      );
    } finally {
      setIsChangingPassword(false);
    }
  });

  const handleDeleteAnnouncement = async (announcementId: number) => {
    if (!token) {
      showErrorToast("لازم تسجل دخولك قبل حذف الإعلان.");
      return;
    }

    setPendingDeleteAnnouncementId(null);

    try {
      setDeletingAnnouncementId(announcementId);

      const { response, data: result } = await apiFetchJson<
        Record<string, unknown>
      >(`/seller/announcements/${announcementId}/`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          getApiMessageInArabic(result, "تعذّر حذف الإعلان حالياً."),
        );
      }

      setProfileData((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          announcements_data: {
            ...current.announcements_data,
            count: Math.max(0, current.announcements_data.count - 1),
            results: current.announcements_data.results.filter(
              (announcement) => announcement.id !== announcementId,
            ),
          },
        };
      });

      showSuccessToast(getApiMessageInArabic(result, "تم حذف الإعلان بنجاح."));
    } catch (error) {
      showErrorToast(
        getErrorMessageInArabic(error, "حدث خطأ أثناء حذف الإعلان."),
      );
    } finally {
      setDeletingAnnouncementId(null);
    }
  };

  useEffect(() => {
    if (!pendingDeleteAnnouncementId) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && deletingAnnouncementId === null) {
        setPendingDeleteAnnouncementId(null);
      }
    };

    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("keydown", onEscape);
    };
  }, [deletingAnnouncementId, pendingDeleteAnnouncementId]);

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-[#0e0e0e] px-4 py-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center rounded-[2rem] border border-white/8 bg-[#141414] px-6 py-16 text-center shadow-2xl sm:px-10">
          <div className="mb-6 rounded-3xl border border-accent/20 bg-accent/10 p-4 text-accent">
            <UserRound className="h-10 w-10" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white">الملف الشخصي</h1>
          <p className="mb-8 max-w-xl text-sm leading-8 text-gray-400 sm:text-base">
            لعرض الملف الشخصي والإعدادات وتعديل بياناتك، لازم تسجل دخولك أولاً.
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

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#0e0e0e] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <ProfileHeader
          displayName={displayName}
          displayDescription={displayDescription}
          displayCountry={displayCountry}
          displayWhatsapp={displayWhatsapp}
          profileInitials={profileInitials}
          announcementCount={announcementCount}
        />

        <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />

        {profileError ? (
          <div className="flex items-start gap-3 rounded-[1.5rem] border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-red-200">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{profileError}</p>
          </div>
        ) : null}

        {activeTab === "announcements" ? (
          <ProfileAnnouncementsTab
            isLoading={isLoadingProfile}
            announcements={announcements}
            announcementCount={announcementCount}
            deletingAnnouncementId={deletingAnnouncementId}
            onDeleteRequest={setPendingDeleteAnnouncementId}
          />
        ) : null}

        {activeTab === "settings" ? (
          <ProfileSettingsTab
            displayCountry={displayCountry}
            displayWhatsapp={displayWhatsapp}
            isSavingProfile={isSavingProfile}
            isChangingPassword={isChangingPassword}
            nextPassword={nextPassword}
            profileForm={profileForm}
            passwordForm={passwordForm}
            announcementCount={announcementCount}
            onSubmitProfile={onSubmitProfile}
            onSubmitPassword={onSubmitPassword}
          />
        ) : null}

        <ProfileDeleteDialog
          isOpen={pendingDeleteAnnouncementId !== null}
          isDeleting={deletingAnnouncementId !== null}
          onCancel={() => {
            if (deletingAnnouncementId === null) {
              setPendingDeleteAnnouncementId(null);
            }
          }}
          onConfirm={() => {
            if (pendingDeleteAnnouncementId) {
              void handleDeleteAnnouncement(pendingDeleteAnnouncementId);
            }
          }}
        />
      </div>
    </div>
  );
}
