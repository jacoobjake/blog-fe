import { AdminHeader, AdminSideMenu } from "@/components/nav/admin";
import { COOKIE_NAME } from "@/constants";
import { getServerApi } from "@/lib/apis/server";
import type { Theme } from "@/lib/types";
import { getErrorStatus } from "@/lib/utils/api-error";
import { isTheme } from "@/lib/utils/theme";
import AdminUiProvider from "@/providers/admin-ui-provider";
import { cookies } from "next/headers";
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

  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get(COOKIE_NAME.THEME)?.value;
  const theme: Theme = isTheme(cookieTheme) ? cookieTheme : "light";

  return (
    <AdminUiProvider
      initialAuthState={{ user, isAuthenticated: true }}
      initialNavState={{ isSideMenuOpen: true }}
      initialThemeState={{ theme }}
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
