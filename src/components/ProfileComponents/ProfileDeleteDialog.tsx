import { Loader2, Trash2, X } from "lucide-react";

type ProfileDeleteDialogProps = {
  isOpen: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ProfileDeleteDialog({
  isOpen,
  isDeleting,
  onCancel,
  onConfirm,
}: ProfileDeleteDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-[1.75rem] border border-white/10 bg-[#141414] p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-red-300">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">حذف الإعلان</h3>
              <p className="text-sm text-gray-400">هذا الإجراء لا يمكن التراجع عنه.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-full border border-white/10 p-2 text-gray-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-6 text-sm leading-7 text-gray-300">
          هل أنت متأكد أنك تريد حذف هذا الإعلان؟ سيتم إزالته من ملفك نهائيًا.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onConfirm}
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
                تأكيد الحذف
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
