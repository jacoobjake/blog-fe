import { PublicHeader, PublicFooter } from "@/components/nav/public";
import PublicUiProvider from "@/providers/public-ui-provider";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PublicUiProvider>
      <PublicHeader />
      {children}
      <PublicFooter />
    </PublicUiProvider>
  );
}
