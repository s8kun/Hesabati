import type { FormEventHandler } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { Category } from "@/context/MarketplaceMetaContext";

export type AnnouncementFormValues = {
  title: string;
  description: string;
  price_original: string;
  followers: string;
  account_created_at: string;
  status: "active" | "sold";
  account_link: string;
  category_id: string;
};

export type AnnouncementDetailsResponse = {
  id: number;
  title: string;
  description: string;
  price_original: string;
  followers: number;
  account_created_at: string;
  status: "active" | "sold";
  created_at: string;
  account_link: string;
  category: string;
};

export type AnnouncementEditorFormProps = {
  categories: Category[];
  isEditMode: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  form: UseFormReturn<AnnouncementFormValues>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onDeleteRequest: () => void;
};
