import PublicBreadcrumbs from "@/components/nav/public/breadcrumbs";
import { BreadcrumbProvider } from "@/providers/breadcrumb-provider";

export default function ContentsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <BreadcrumbProvider>
            <div className="w-full min-h-screen flex justify-center items-start">
                <main className="w-full max-w-5xl mx-auto p-6">
                    <PublicBreadcrumbs />
                    {children}
                </main>
            </div>
        </BreadcrumbProvider>
    );
}
