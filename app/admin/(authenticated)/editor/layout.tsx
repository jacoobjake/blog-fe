import { getServerApi } from "@/lib/apis/server";
import { getErrorStatus } from "@/lib/utils/api-error";
import AdminUiProvider from "@/providers/admin-ui-provider";
import { redirect } from "next/navigation";

export default async function EditorLayout({
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

  return <AdminUiProvider>{children}</AdminUiProvider>;
}
