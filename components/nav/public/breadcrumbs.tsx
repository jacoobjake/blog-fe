"use client";

import { NAV_ROUTES } from "@/constants";
import { Crumb, generateCrumbs } from "@/lib/utils/route";
import { useBreadcrumbContext } from "@/providers/breadcrumb-provider";
import { Breadcrumbs } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export function buildPublicCrumbs(pathname: string, pageLabel?: string | null) {
  const labelOverrides =
    pageLabel && pathname !== "/"
      ? { [pathname]: pageLabel }
      : undefined;

  return generateCrumbs(pathname, NAV_ROUTES, { labelOverrides });
}

export function PublicBreadcrumbsList({
  crumbs,
  linkable = true,
}: {
  crumbs: Crumb[];
  linkable?: boolean;
}) {
  if (crumbs.length === 0) {
    return null;
  }

  return (
    <Breadcrumbs className="mb-6">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <Breadcrumbs.Item
            key={`${crumb.href}-${index}`}
            href={linkable && !isLast ? crumb.href : undefined}
          >
            {crumb.label}
          </Breadcrumbs.Item>
        );
      })}
    </Breadcrumbs>
  );
}

export default function PublicBreadcrumbs() {
  const pathname = usePathname();
  const { pageLabel } = useBreadcrumbContext();

  const crumbs = useMemo(
    () => buildPublicCrumbs(pathname, pageLabel),
    [pathname, pageLabel],
  );

  return <PublicBreadcrumbsList crumbs={crumbs} />;
}
