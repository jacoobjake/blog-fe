import type { Metadata } from "next";
import { Figtree, Playfair_Display } from "next/font/google";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: "Everything About Jake, Gan and Jimmy",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${figtree.variable} ${playfair.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                  try {
                      var theme = localStorage.getItem('theme-storage');
                      if (!theme) {
                          theme = window.matchMedia('(prefers-color-scheme: dark)').matches
                              ? 'dark'
                              : 'light';
                      }
                      if (theme === 'dark') {
                          document.documentElement.classList.add('dark');
                      }
                  } catch (_) {}
              })();`,
          }}
        />
      </head>
      <body className="bg-background">{children}</body>
    </html>
  );
}
