import EditAuthorPageContent from "./edit-author-page-content";
import { BackButton } from "@/components/nav";
import {
  DeleteAuthorButton,
  SaveAuthorButton,
} from "@/components/authors/author-page-actions";
import { AdminPage, AdminPageSection } from "@/components/ui/containers";
import { getServerApi } from "@/lib/apis/server";
import { canManageAuthors } from "@/lib/utils/author-permissions";
import { redirect } from "next/navigation";

const FORM_ID = "author-profile-form";

export default async function EditAuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, api] = await Promise.all([params, getServerApi()]);
  const user = await api.auth.me();

  if (!canManageAuthors(user)) {
    redirect("/admin");
  }

  const author = await api.authors.getAuthor(id);

  return (
    <AdminPage title={`Edit ${author.name}`}>
      <BackButton href="/admin/authors" data-slot="pre-action" />
      <AdminPageSection data-slot-container>
        <SaveAuthorButton
          formId={FORM_ID}
          data-slot="extra-actions"
          data-slot-priority={10}
        />
        <DeleteAuthorButton
          authorId={author.id}
          authorName={author.name}
          data-slot="extra-actions"
          data-slot-priority={20}
        />
        <EditAuthorPageContent author={author} formId={FORM_ID} />
      </AdminPageSection>
    </AdminPage>
  );
}
