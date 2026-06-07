"use client";

import { getIcon } from "@/lib/resolvers/icon-resolver";
import { ADMIN_NAV_ROUTES } from "@/constants/routes";
import { Button, cn, Link, Separator } from "@heroui/react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useAdminNav } from "@/hooks/nav";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { matchesRoutePattern } from "@/lib/utils/route";

export default function AdminSideMenu() {
  const isSideMenuOpen = useAdminNav((state) => state.isSideMenuOpen);
  const setIsSideMenuOpen = useAdminNav((state) => state.setIsSideMenuOpen);
  const pathname = usePathname();

  const isActivePath = (pattern: string) =>
    matchesRoutePattern(pathname, pattern);

  return (
    <motion.div
      initial={false}
      animate={{ width: isSideMenuOpen ? "20%" : "0%" }}
      className="w-1/6 h-full hidden md:flex bg-surface border-r-2 flex-col overflow-hidden"
    >
      <div className="h-20 w-full p-4 flex justify-end items-center">
        <Button
          variant="ghost"
          isIconOnly
          aria-label="Close sidebar"
          className="rounded-md"
          onPress={() => setIsSideMenuOpen(false)}
        >
          <TbLayoutSidebarLeftCollapse size={14} />
        </Button>
      </div>
      <Separator className="w-5/6 mx-auto" />
      <nav>
        <ul className="flex flex-col space-y-4 text-xl items-start p-4">
          {ADMIN_NAV_ROUTES.map((route) => (
            <Link
              key={route.href}
              className={cn(
                "decoration-0 text-lg w-full transition-all hover:scale-105 gap-2",
                {
                  "text-accent/70": isActivePath(route.pattern),
                  "text-foreground/70": !isActivePath(route.pattern),
                },
              )}
              href={route.href}
            >
              <Link.Icon className="size-6">
                {getIcon(route.icon, 30)}
              </Link.Icon>
              {route.label}
            </Link>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
}
