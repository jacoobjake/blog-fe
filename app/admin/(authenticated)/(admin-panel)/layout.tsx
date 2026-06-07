import { AdminHeader, AdminSideMenu } from "@/components/nav/admin";
import { getServerApi } from "@/lib/apis/server";
import { getErrorStatus } from "@/lib/utils/api-error";
import AdminUiProvider from "@/providers/admin-ui-provider";
import { redirect } from "next/navigation";

export default async function AdminAuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user;
  let status = 200;

  try {
    const api = await getServerApi();
    user = await api.auth.me();
  } catch (error) {
    status = getErrorStatus(error);
  }

  if (!user || status >= 400) {
    redirect("/admin/login");
  }

  return (
    <AdminUiProvider
      initialAuthState={{ user, isAuthenticated: true }}
      initialNavState={{ isSideMenuOpen: true }}
    >
      <div className="w-full h-screen max-h-screen flex">
        <AdminSideMenu />
        <div className="w-full h-full flex flex-col grow">
          <AdminHeader />
          <div className="grow max-h-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </AdminUiProvider>
  );
}
