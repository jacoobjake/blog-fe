"use client";

import { ThemeSwitch } from "@/components/ui/theme";
import { NAV_ROUTES } from "@/constants/routes";
import { matchesRoutePattern } from "@/lib/utils/route";
import { cn } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileMenu from "./mobile-menu";

export default function PublicHeader() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between p-6 gap-8 text-accent bg-surface">
      <h1 className="text-3xl font-bold">
        {process.env.NEXT_PUBLIC_APP_NAME}
      </h1>
      <div className="md:flex justify-end items-center gap-8 hidden">
        <nav>
          <ul className="flex space-x-4 text-xl justify-end">
            {NAV_ROUTES.map((route) => {
              const isActive = matchesRoutePattern(pathname, route.pattern);

              return (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className={cn(
                      "transition-colors",
                      isActive ? "text-accent" : "text-foreground/70 hover:text-accent",
                    )}
                  >
                    {route.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <ThemeSwitch />
      </div>
      <MobileMenu />
    </div>
  );
}
