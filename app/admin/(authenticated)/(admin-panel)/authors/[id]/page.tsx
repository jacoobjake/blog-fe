import EditAuthorPageContent from "./edit-author-page-content";
import { AdminPage } from "@/components/ui/containers";
import { getServerApi } from "@/lib/apis/server";
import { canManageAuthors } from "@/lib/utils/author-permissions";
import { redirect } from "next/navigation";

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
      <EditAuthorPageContent author={author} />
    </AdminPage>
  );
}
