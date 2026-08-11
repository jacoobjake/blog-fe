import CreateAuthorPageContent from "./create-author-page-content";
import { AdminPage } from "@/components/ui/containers";
import { getServerApi } from "@/lib/apis/server";
import { canManageAuthors } from "@/lib/utils/author-permissions";
import { redirect } from "next/navigation";

export default async function CreateAuthorPage() {
  const api = await getServerApi();
  const user = await api.auth.me();

  if (!canManageAuthors(user)) {
    redirect("/admin");
  }

  return (
    <AdminPage title="Create author">
      <CreateAuthorPageContent />
    </AdminPage>
  );
}
