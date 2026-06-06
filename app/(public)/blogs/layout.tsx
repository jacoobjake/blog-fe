export default function BlogsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full min-h-screen flex justify-center items-start">
            <main className="w-full md:w-3/4 mx-auto p-6">
                {children}
            </main>
        </div>
    );
}
