import MyAuthorProfilePageContent from "./my-author-profile-page-content";
import { SaveAuthorButton } from "@/components/authors/author-page-actions";
import { AdminPage } from "@/components/ui/containers";
import { getServerApi } from "@/lib/apis/server";
import { canManageOwnAuthorProfile } from "@/lib/utils/author-permissions";
import { getErrorStatus } from "@/lib/utils/api-error";
import { redirect } from "next/navigation";

const FORM_ID = "own-author-profile-form";

export default async function MyAuthorProfilePage() {
  const api = await getServerApi();
  const user = await api.auth.me();

  if (!canManageOwnAuthorProfile(user)) {
    redirect("/admin");
  }

  try {
    const author = await api.authors.getMyAuthorProfile();

    return (
      <AdminPage title="My Author Profile">
        <SaveAuthorButton
          formId={FORM_ID}
          label="Save profile"
          data-slot="extra-actions"
          data-slot-priority={10}
        />
        <MyAuthorProfilePageContent author={author} formId={FORM_ID} />
      </AdminPage>
    );
  } catch (error) {
    if (getErrorStatus(error) === 404) {
      return (
        <AdminPage title="My Author Profile">
          <p className="text-muted">
            You do not have an author profile yet. Ask a superadmin to create
            one and link it to your account.
          </p>
        </AdminPage>
      );
    }

    throw error;
  }
}
