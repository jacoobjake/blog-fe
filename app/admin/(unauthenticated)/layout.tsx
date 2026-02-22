import { getServerApi } from "@/lib/apis/server";
import { getErrorStatus } from "@/lib/utils/api-error";
import { AuthContextProvider } from "@/providers/auth-provider";
import { redirect } from "next/navigation";

export default async function AdminUnauthenticatedLayout({
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
    console.log(error);
  }

  if (!!user?.id && status === 200) {
    redirect("/admin");
  }

  return <AuthContextProvider>{children}</AuthContextProvider>;
}
