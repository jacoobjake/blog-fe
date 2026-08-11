import { AuthorList } from "@/components/datatables/authors";
import { AdminPage } from "@/components/ui/containers";
import { getServerApi } from "@/lib/apis/server";
import { canManageAuthors } from "@/lib/utils/author-permissions";
import { redirect } from "next/navigation";
import AdminAuthorsActions from "./authors-actions";

export default async function AdminAuthorsPage() {
  const api = await getServerApi();
  const user = await api.auth.me();

  if (!canManageAuthors(user)) {
    redirect("/admin");
  }

  return (
    <AdminPage title="Authors">
      <AdminAuthorsActions data-slot="extra-actions" />
      <AuthorList />
    </AdminPage>
  );
}
