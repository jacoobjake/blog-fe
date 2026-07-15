import { PublicHeader, PublicFooter } from "@/components/nav/public";
import { COOKIE_NAME } from "@/constants";
import { isTheme } from "@/lib/utils/theme";
import PublicUiProvider from "@/providers/public-ui-provider";
import type { Theme } from "@/lib/types";
import { cookies } from "next/headers";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get(COOKIE_NAME.THEME)?.value;
  const theme: Theme = isTheme(cookieTheme) ? cookieTheme : "light";

  return (
    <PublicUiProvider initialThemeState={{ theme }}>
      <PublicHeader />
      {children}
      <PublicFooter />
    </PublicUiProvider>
  );
}
