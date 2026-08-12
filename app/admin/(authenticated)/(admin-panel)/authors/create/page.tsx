import CreateAuthorPageContent from "./create-author-page-content";
import { BackButton } from "@/components/nav";
import { SaveAuthorButton } from "@/components/authors/author-page-actions";
import { AdminPage } from "@/components/ui/containers";
import { getServerApi } from "@/lib/apis/server";
import { canManageAuthors } from "@/lib/utils/author-permissions";
import { redirect } from "next/navigation";

const FORM_ID = "create-author-profile-form";

export default async function CreateAuthorPage() {
  const api = await getServerApi();
  const user = await api.auth.me();

  if (!canManageAuthors(user)) {
    redirect("/admin");
  }

  return (
    <AdminPage title="Create author">
      <BackButton href="/admin/authors" data-slot="pre-action" />
      <SaveAuthorButton
        formId={FORM_ID}
        label="Create author"
        data-slot="extra-actions"
        data-slot-priority={10}
      />
      <CreateAuthorPageContent formId={FORM_ID} />
    </AdminPage>
  );
}
