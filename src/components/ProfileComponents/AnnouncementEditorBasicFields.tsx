import { FileText } from "lucide-react";
import type { AnnouncementEditorFormProps } from "./announcementEditor.types";

type AnnouncementEditorBasicFieldsProps = Pick<
  AnnouncementEditorFormProps,
  "form"
>;

export default function AnnouncementEditorBasicFields({
  form,
}: AnnouncementEditorBasicFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-300">
          عنوان الإعلان
        </label>
        <p className="text-xs leading-6 text-gray-500">
          اكتب اسمًا مباشرًا يوضح نوع الحساب أو الخدمة من أول نظرة.
        </p>
        <div className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 transition focus-within:border-accent focus-within:ring-1 focus-within:ring-accent">
          <FileText className="h-5 w-5 shrink-0 text-gray-500" />
          <input
            type="text"
            placeholder="مثال: حساب TikTok موثق جاهز للإعلانات"
            className="h-full w-full border-0 bg-transparent px-0 text-white outline-none placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
            {...register("title", {
              required: "عنوان الإعلان مطلوب",
              minLength: {
                value: 3,
                message: "عنوان الإعلان قصير جدًا",
              },
            })}
          />
        </div>
        {errors.title ? (
          <p className="text-sm text-red-400">{errors.title.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-300">
          وصف الإعلان
        </label>
        <p className="text-xs leading-6 text-gray-500">
          اذكر أهم التفاصيل التي تهم المشتري مثل نوع المحتوى أو البلد أو مميزات
          الحساب الحالية.
        </p>
        <textarea
          rows={5}
          placeholder="مثال: الحساب مخصص للسوق الليبي، فيه تفاعل جيد، وما عليه مخالفات، ومناسب للإعلانات أو البيع المباشر."
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-gray-600 focus:border-accent focus:ring-1 focus:ring-accent"
          {...register("description", {
            required: "وصف الإعلان مطلوب",
            minLength: {
              value: 3,
              message: "الوصف قصير جدًا",
            },
          })}
        />
        {errors.description ? (
          <p className="text-sm text-red-400">{errors.description.message}</p>
        ) : null}
      </div>
    </>
  );
}
