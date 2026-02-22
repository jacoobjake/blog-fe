"use client";

import { ADMIN_NAV_ROUTES } from "@/constants/routes";
import { generateCrumbs } from "@/lib/utils/route";
import { Breadcrumbs } from "@heroui/react";
import { usePathname } from "next/navigation";

export default function AdminBreadcrumbs() {
  const pathname = usePathname();
  const crumbs = generateCrumbs(pathname, ADMIN_NAV_ROUTES);
  return (
    <Breadcrumbs>
      {crumbs.map((crumb, index) => (
        <Breadcrumbs.Item key={index} href={crumb.href}>
          {crumb.label}
        </Breadcrumbs.Item>
      ))}
    </Breadcrumbs>
  );
}
