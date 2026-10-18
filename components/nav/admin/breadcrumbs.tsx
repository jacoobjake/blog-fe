"use client";

import { generateCrumbs } from "@/lib/utils/route";
import { getAdminNavRoutes } from "@/lib/utils/admin-nav";
import { Breadcrumbs } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth";

export default function AdminBreadcrumbs() {
  const pathname = usePathname();
  const { user } = useAuth();
  const crumbs = generateCrumbs(pathname, getAdminNavRoutes(user));
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
