import { ChangePasswordForm } from "@/components/forms/auth";
import { AdminPage } from "@/components/ui/containers";
import { getServerApi } from "@/lib/apis/server";

export default async function AdminProfilePage() {
  const api = await getServerApi();
  const user = await api.auth.me();

  return (
    <AdminPage title="Profile">
      <div className="max-w-md space-y-8">
        <div className="space-y-1">
          <p className="text-sm text-foreground-500">Name</p>
          <p className="font-medium">{user.name}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-foreground-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Change password</h2>
          <ChangePasswordForm />
        </div>
      </div>
    </AdminPage>
  );
}
