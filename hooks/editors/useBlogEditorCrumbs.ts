"use client";

import { buildPublicCrumbs } from "@/components/nav/public/breadcrumbs";
import { Crumb } from "@/lib/utils/route";
import { useMemo } from "react";

export function useBlogEditorCrumbs(slug: string | undefined, title: string) {
  return useMemo((): Crumb[] => {
    if (slug) {
      return buildPublicCrumbs(`/blogs/${slug}`, title);
    }

    return [
      ...buildPublicCrumbs("/blogs"),
      { label: title, href: "/blogs" },
    ];
  }, [slug, title]);
}
