import AnnouncementEditorActions from "./AnnouncementEditorActions";
import AnnouncementEditorBasicFields from "./AnnouncementEditorBasicFields";
import AnnouncementEditorDetailsFields from "./AnnouncementEditorDetailsFields";
import type { AnnouncementEditorFormProps } from "./announcementEditor.types";

export default function AnnouncementEditorForm({
  categories,
  isEditMode,
  isSubmitting,
  isDeleting,
  form,
  onSubmit,
  onDeleteRequest,
}: AnnouncementEditorFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <AnnouncementEditorBasicFields form={form} />
      <AnnouncementEditorDetailsFields
        categories={categories}
        form={form}
        isEditMode={isEditMode}
      />
      <AnnouncementEditorActions
        isDeleting={isDeleting}
        isEditMode={isEditMode}
        isSubmitting={isSubmitting}
        onDeleteRequest={onDeleteRequest}
      />
    </form>
  );
}
