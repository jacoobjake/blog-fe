import { ThemeSwitch } from "@/components/ui/theme";
import { NAV_ROUTES } from "@/constants/routes";
import { ThemeContextProvider } from "@/providers";
import MobileMenu from "./mobile-menu";

export default async function PublicHeader() {
  return (
    <ThemeContextProvider>
      <div className="flex items-center justify-between p-6 gap-8 text-accent bg-surface">
        <h1 className="text-3xl font-bold">
          {process.env.NEXT_PUBLIC_APP_NAME}
        </h1>
        <div className="md:flex justify-end items-center gap-8 hidden">
          <nav>
            <ul className="flex space-x-4 text-xl justify-end">
              {NAV_ROUTES.map((route) => (
                <li key={route.href}>
                  <a href={route.href}>{route.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeSwitch />
        </div>
        <MobileMenu />
      </div>
    </ThemeContextProvider>
  );
}
