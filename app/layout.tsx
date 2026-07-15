import type { Metadata } from "next";
import { Figtree, Playfair_Display } from "next/font/google";
import { cookies } from "next/headers";

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
import { COOKIE_NAME, THEME_STORAGE_KEY } from "@/constants";
import { isTheme } from "@/lib/utils/theme";
import type { Theme } from "@/lib/types";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: "Everything About Jake, Gan and Jimmy",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get(COOKIE_NAME.THEME)?.value;
  const theme: Theme = isTheme(cookieTheme) ? cookieTheme : "light";

  return (
    <html
      suppressHydrationWarning
      lang="en"
      data-theme={theme}
      className={`${figtree.variable} ${playfair.variable} relative ${theme}`}
      style={{ colorScheme: theme }}
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
                      if (theme !== 'light' && theme !== 'dark') {
                          theme = window.matchMedia('(prefers-color-scheme: dark)').matches
                              ? 'dark'
                              : 'light';
                      }
                      var root = document.documentElement;
                      root.setAttribute('data-theme', theme);
                      root.classList.toggle('dark', theme === 'dark');
                      root.classList.toggle('light', theme === 'light');
                      root.style.colorScheme = theme;
                      document.cookie = ${JSON.stringify(COOKIE_NAME.THEME)} + '=' + theme + '; path=/; max-age=31536000; SameSite=Lax';
                  } catch (_) {}
              })();`,
          }}
        />
      </head>
      <body className="bg-background text-foreground relative">{children}</body>
    </html>
  );
}
