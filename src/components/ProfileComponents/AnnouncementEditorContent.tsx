import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useMarketplaceMeta } from "@/context/MarketplaceMetaContext";
import { apiFetch, apiFetchJson, safeParseJson } from "@/lib/apiFetch";
import {
  getApiMessageInArabic,
  getErrorMessageInArabic,
  showErrorToast,
  showSuccessToast,
} from "@/lib/toast";
import AnnouncementDeleteDialog from "./AnnouncementDeleteDialog";
import AnnouncementEditorAuthPrompt from "./AnnouncementEditorAuthPrompt";
import AnnouncementEditorForm from "./AnnouncementEditorForm";
import AnnouncementEditorHeader from "./AnnouncementEditorHeader";
import type {
  AnnouncementDetailsResponse,
  AnnouncementFormValues,
} from "./announcementEditor.types";
import { fetchAnnouncementCategories } from "./announcementEditor.utils";

export default function AnnouncementEditorContent() {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token as string | undefined;
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { categories, setCategories } = useMarketplaceMeta();

  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const form = useForm<AnnouncementFormValues>({
    defaultValues: {
      title: "",
      description: "",
      price_original: "",
      followers: "",
      account_created_at: "",
      status: "active",
      account_link: "",
      category_id: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setIsLoadingPage(false);
      setPageError(null);
      return;
    }

    const abortController = new AbortController();

    const loadPageData = async () => {
      try {
        setIsLoadingPage(true);
        setPageError(null);

        let availableCategories = categories;
        if (availableCategories.length === 0) {
          availableCategories = await fetchAnnouncementCategories();
          setCategories(availableCategories);
        }

        if (isEditMode && id) {
          const response = await apiFetch(`/seller/announcements/${id}/`, {
            signal: abortController.signal,
            headers: {
              Accept: "application/json",
            },
          });

          const result = await safeParseJson<Record<string, unknown>>(response);

          if (!response.ok) {
            throw new Error(
              getApiMessageInArabic(
                result,
                "تعذّر تحميل بيانات الإعلان الحالي.",
              ),
            );
          }

          const announcement = result as AnnouncementDetailsResponse;
          const matchedCategory = availableCategories.find(
            (category) =>
              category.name.toLowerCase() ===
              announcement.category.toLowerCase(),
          );

          form.reset({
            title: announcement.title || "",
            description: announcement.description || "",
            price_original: announcement.price_original || "",
            followers: String(announcement.followers || ""),
            account_created_at:
              announcement.account_created_at?.split("T")[0] || "",
            status: announcement.status || "active",
            account_link: announcement.account_link || "",
            category_id: matchedCategory ? String(matchedCategory.id) : "",
          });
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setPageError(
          getErrorMessageInArabic(error, "تعذّر تجهيز صفحة الإعلان حالياً."),
        );
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoadingPage(false);
        }
      }
    };

    loadPageData();

    return () => {
      abortController.abort();
    };
  }, [categories, form, id, isEditMode, setCategories, token]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!token) {
      showErrorToast("لازم تسجل دخولك قبل إنشاء أو تعديل الإعلان.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        price_original: Number(values.price_original),
        followers: Number(values.followers),
        account_created_at: values.account_created_at,
        status: isEditMode ? values.status : "active",
        account_link: values.account_link.trim(),
        category_id: Number(values.category_id),
      };

      const { response, data: result } = await apiFetchJson<
        Record<string, unknown>
      >(
        isEditMode && id
          ? `/seller/announcements/${id}/`
          : "/seller/announcements/",
        {
          method: isEditMode ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(
          getApiMessageInArabic(
            result,
            isEditMode
              ? "تعذّر تحديث الإعلان، حاول مرة أخرى."
              : "تعذّر إنشاء الإعلان، تحقق من البيانات ثم حاول مجددًا.",
          ),
        );
      }

      showSuccessToast(
        getApiMessageInArabic(
          result,
          isEditMode ? "تم تحديث الإعلان بنجاح." : "تم إنشاء الإعلان بنجاح.",
        ),
      );
      navigate("/profile");
    } catch (error) {
      showErrorToast(
        getErrorMessageInArabic(
          error,
          isEditMode
            ? "حدث خطأ أثناء تحديث الإعلان."
            : "حدث خطأ أثناء إنشاء الإعلان.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleDelete = async () => {
    if (!token || !id || !isEditMode) {
      return;
    }

    setIsDeleteModalOpen(false);

    try {
      setIsDeleting(true);

      const { response, data: result } = await apiFetchJson<
        Record<string, unknown>
      >(`/seller/announcements/${id}/`, {
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

      showSuccessToast(getApiMessageInArabic(result, "تم حذف الإعلان بنجاح."));
      navigate("/profile");
    } catch (error) {
      showErrorToast(
        getErrorMessageInArabic(error, "حدث خطأ أثناء حذف الإعلان."),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!isDeleteModalOpen) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) {
        setIsDeleteModalOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("keydown", onEscape);
    };
  }, [isDeleteModalOpen, isDeleting]);

  if (!token) {
    return <AnnouncementEditorAuthPrompt />;
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#0e0e0e] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <AnnouncementEditorHeader
          isEditMode={isEditMode}
        />

        {pageError ? (
          <div className="rounded-[1.5rem] border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-red-200">
            {pageError}
          </div>
        ) : null}

        <section>
          <div className="rounded-[1.75rem] border border-white/6 bg-[#141414] p-6 shadow-2xl sm:p-7">
            {isLoadingPage ? (
              <div className="flex min-h-80 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
              </div>
            ) : (
              <AnnouncementEditorForm
                categories={categories}
                isEditMode={isEditMode}
                isSubmitting={isSubmitting}
                isDeleting={isDeleting}
                form={form}
                onSubmit={onSubmit}
                onDeleteRequest={() => setIsDeleteModalOpen(true)}
              />
            )}
          </div>
        </section>
      </div>

      <AnnouncementDeleteDialog
        isOpen={isEditMode && isDeleteModalOpen}
        isDeleting={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
