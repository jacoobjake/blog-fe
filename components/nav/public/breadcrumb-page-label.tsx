"use client";

import { useBreadcrumbContext } from "@/providers/breadcrumb-provider";
import { useEffect } from "react";

export default function BreadcrumbPageLabel({ label }: { label: string }) {
  const { setPageLabel } = useBreadcrumbContext();

  useEffect(() => {
    setPageLabel(label);
    return () => setPageLabel(null);
  }, [label, setPageLabel]);

  return null;
}
