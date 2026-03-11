import { Loader2, Save, Trash2 } from "lucide-react";
import type { AnnouncementEditorFormProps } from "./announcementEditor.types";

type AnnouncementEditorActionsProps = Pick<
  AnnouncementEditorFormProps,
  "isDeleting" | "isEditMode" | "isSubmitting" | "onDeleteRequest"
>;

export default function AnnouncementEditorActions({
  isDeleting,
  isEditMode,
  isSubmitting,
  onDeleteRequest,
}: AnnouncementEditorActionsProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-white/6 pt-5 sm:flex-row">
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 font-bold text-black transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {isEditMode ? "جاري التحديث..." : "جاري الإنشاء..."}
          </>
        ) : (
          <>
            <Save className="h-5 w-5" />
            {isEditMode ? "حفظ التعديلات" : "إنشاء الإعلان"}
          </>
        )}
      </button>

      {isEditMode ? (
        <button
          type="button"
          onClick={onDeleteRequest}
          disabled={isDeleting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 px-5 py-3 font-bold text-red-200 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isDeleting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              جاري الحذف...
            </>
          ) : (
            <>
              <Trash2 className="h-5 w-5" />
              حذف الإعلان
            </>
          )}
        </button>
      ) : null}
    </div>
  );
}
