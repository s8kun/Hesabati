import { CircleAlert, Loader2, X } from "lucide-react";

type AnnouncementDeleteDialogProps = {
  isOpen: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function AnnouncementDeleteDialog({
  isOpen,
  isDeleting,
  onCancel,
  onConfirm,
}: AnnouncementDeleteDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-announcement-modal-title"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-2xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="إغلاق نافذة التأكيد"
          onClick={onCancel}
          disabled={isDeleting}
          className="absolute end-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="pt-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300">
            <CircleAlert className="h-6 w-6" />
          </div>
          <h3
            id="delete-announcement-modal-title"
            className="mb-3 text-lg font-bold text-white"
          >
            تأكيد حذف الإعلان
          </h3>
          <p className="mb-6 text-sm leading-7 text-gray-300">
            هل أنت متأكد أنك تريد حذف هذا الإعلان نهائيًا؟ لا يمكن التراجع عن
            هذه العملية بعد التنفيذ.
          </p>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              لا، إلغاء
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/25 bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                "نعم، احذف الإعلان"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
