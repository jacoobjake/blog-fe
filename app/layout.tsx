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
import { THEME_STORAGE_KEY } from "@/constants";

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
      className={`${figtree.variable} ${playfair.variable} relative`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                  try {
                      var theme = null;
                      var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
                      if (stored) {
                          var parsed = JSON.parse(stored);
                          theme = parsed.state && parsed.state.theme;
                      }
                      if (!theme) {
                          theme = window.matchMedia('(prefers-color-scheme: dark)').matches
                              ? 'dark'
                              : 'light';
                      }
                      document.documentElement.setAttribute('data-theme', theme);
                      document.documentElement.classList.toggle('dark', theme === 'dark');
                  } catch (_) {}
              })();`,
          }}
        />
      </head>
      <body className="bg-background relative">{children}</body>
    </html>
  );
}
