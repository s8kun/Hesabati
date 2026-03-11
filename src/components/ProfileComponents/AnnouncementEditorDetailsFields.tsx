import { format } from "date-fns";
import {
  BadgeDollarSign,
  CalendarDays,
  CircleDot,
  FolderPlus,
  Link2,
  Users,
} from "lucide-react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AnnouncementEditorFormProps } from "./announcementEditor.types";
import { announcementStatusOptions } from "./announcementEditor.utils";

type AnnouncementEditorDetailsFieldsProps = Pick<
  AnnouncementEditorFormProps,
  "categories" | "form" | "isEditMode"
>;

export default function AnnouncementEditorDetailsFields({
  categories,
  form,
  isEditMode,
}: AnnouncementEditorDetailsFieldsProps) {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = form;

  const selectedCategoryName =
    categories.find((category) => String(category.id) === watch("category_id"))
      ?.name || "";

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-300">
          السعر الأصلي
        </label>
        <p className="text-xs leading-6 text-gray-500">
          أدخل السعر بعملة دولة الحساب أو العملة التي يفهمها المشتري المستهدف
          بشكل مباشر.
        </p>
        <div
          className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 transition focus-within:border-accent focus-within:ring-1 focus-within:ring-accent"
          dir="ltr"
        >
          <BadgeDollarSign className="h-5 w-5 shrink-0 text-gray-500" />
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="مثال: 2500"
            className="h-full border-0 bg-transparent px-0 text-left text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
            {...register("price_original", {
              required: "السعر مطلوب",
              validate: (value) =>
                Number(value) > 0 || "السعر يجب أن يكون أكبر من صفر",
            })}
          />
        </div>
        {errors.price_original ? (
          <p className="text-sm text-red-400">{errors.price_original.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-300">
          عدد المتابعين
        </label>
        <p className="text-xs leading-6 text-gray-500">
          اكتب العدد الحالي التقريبي للمتابعين حتى يكون تقييم الإعلان واقعيًا
          وواضحًا.
        </p>
        <div
          className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 transition focus-within:border-accent focus-within:ring-1 focus-within:ring-accent"
          dir="ltr"
        >
          <Users className="h-5 w-5 shrink-0 text-gray-500" />
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="6000"
            className="h-full border-0 bg-transparent px-0 text-left text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
            {...register("followers", {
              required: "عدد المتابعين مطلوب",
              validate: (value) =>
                Number(value) >= 0 || "عدد المتابعين غير صالح",
            })}
          />
        </div>
        {errors.followers ? (
          <p className="text-sm text-red-400">{errors.followers.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-300">
          تاريخ إنشاء الحساب
        </label>
        <p className="text-xs leading-6 text-gray-500">
          اختر التاريخ الحقيقي أو الأقرب له، لأن عمر الحساب يؤثر على قرار
          الشراء.
        </p>
        <Controller
          name="account_created_at"
          control={control}
          rules={{ required: "تاريخ إنشاء الحساب مطلوب" }}
          render={({ field }) => {
            const selectedDate = field.value
              ? new Date(`${field.value}T00:00:00`)
              : undefined;

            return (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 w-full justify-between rounded-2xl border-white/20 bg-white/[0.04] px-3 text-left font-normal text-white hover:bg-white/8"
                    dir="ltr"
                  >
                    <span
                      className={field.value ? "text-white" : "text-white/70"}
                    >
                      {field.value
                        ? format(selectedDate as Date, "yyyy/MM/dd")
                        : "اختر تاريخ إنشاء الحساب"}
                    </span>
                    <CalendarDays className="h-4 w-4 text-white/70" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto rounded-2xl border border-white/10 bg-[#141414] p-1 text-white"
                  align="start"
                >
                  <Calendar
                    className="text-white"
                    classNames={{
                      caption_label: "text-white",
                      day: "text-white",
                      day_button:
                        "text-white hover:bg-accent hover:text-black data-[selected-single=true]:bg-accent data-[selected-single=true]:text-white data-[range-start=true]:bg-accent data-[range-start=true]:text-white data-[range-end=true]:bg-accent data-[range-end=true]:text-white",
                      weekday: "text-white/75",
                      outside: "text-white/45 aria-selected:text-white/45",
                      disabled: "text-white/30",
                      today:
                        "text-white border border-accent/50 data-[selected=true]:bg-accent data-[selected=true]:text-white",
                    }}
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) =>
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                    }
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(23, 59, 59, 999);
                      return date > today;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            );
          }}
        />
        {errors.account_created_at ? (
          <p className="text-sm text-red-400">
            {errors.account_created_at.message}
          </p>
        ) : null}
      </div>

      {isEditMode ? (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">
            حالة الإعلان
          </label>
          <p className="text-xs leading-6 text-gray-500">
            حدد هل الإعلان متاح الآن للبيع أو تم بيعه بالفعل.
          </p>
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 transition focus-within:border-accent focus-within:ring-1 focus-within:ring-accent">
            <CircleDot className="h-5 w-5 shrink-0 text-gray-500" />
            <Controller
              name="status"
              control={control}
              rules={{ required: "حالة الإعلان مطلوبة" }}
              render={({ field }) => (
                <Select
                  aria-label="حالة الإعلان"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    size="sm"
                    className="h-full w-full border-0 bg-transparent px-0 text-white shadow-none outline-none ring-0 focus:ring-0"
                  >
                    <SelectValue placeholder="اختر حالة الإعلان" />
                  </SelectTrigger>
                  <SelectContent className="mt-1 rounded-xl border border-white/10 bg-[#141414] text-white shadow-2xl">
                    {announcementStatusOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-white"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {errors.status ? (
            <p className="text-sm text-red-400">{errors.status.message}</p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-300">التصنيف</label>
        <p className="text-xs leading-6 text-gray-500">
          اختر المنصة أو نوع الحساب الأقرب لإعلانك حتى يظهر للمشتري الصحيح داخل
          التصفية والبحث.
        </p>
        <div className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 transition focus-within:border-accent focus-within:ring-1 focus-within:ring-accent">
          <FolderPlus className="h-5 w-5 shrink-0 text-gray-500" />
          <Controller
            name="category_id"
            control={control}
            rules={{ required: "التصنيف مطلوب" }}
            render={({ field }) => (
              <Select
                aria-label="تصنيف الإعلان"
                value={field.value || ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  size="sm"
                  className="h-full w-full border-0 bg-transparent px-0 text-white shadow-none outline-none ring-0 focus:ring-0 data-[placeholder]:text-gray-500"
                >
                  <SelectValue>
                    <span
                      className={
                        selectedCategoryName ? "text-white" : "text-gray-500"
                      }
                    >
                      {selectedCategoryName || "اختر التصنيف المناسب"}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="mt-1 rounded-xl border border-white/10 bg-[#141414] text-white shadow-2xl">
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={String(category.id)}
                      className="text-white"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {errors.category_id ? (
          <p className="text-sm text-red-400">{errors.category_id.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-300">
          رابط الحساب
        </label>
        <p className="text-xs leading-6 text-gray-500">
          أضف رابط الحساب أو رابط معاينة موثوق حتى يقدر المشتري يراجع الإعلان
          بسرعة.
        </p>
        <div
          className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 transition focus-within:border-accent focus-within:ring-1 focus-within:ring-accent"
          dir="ltr"
        >
          <Link2 className="h-5 w-5 shrink-0 text-gray-500" />
          <Input
            type="url"
            placeholder="https://example.com/account-link"
            className="h-full border-0 bg-transparent px-0 text-left text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
            {...register("account_link", {
              required: "رابط الحساب مطلوب",
            })}
          />
        </div>
        {errors.account_link ? (
          <p className="text-sm text-red-400">{errors.account_link.message}</p>
        ) : null}
      </div>
    </div>
  );
}
