import PublicHeader from "@/components/nav/public/header";
import PublicFooter from "@/components/nav/public/footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PublicHeader />
      {children}
      <PublicFooter />
    </>
  );
}
