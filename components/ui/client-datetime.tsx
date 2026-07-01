"use client";

import { useEffect, useState } from "react";
import { dateToDatetimeString } from "@/lib/utils/date";

type ClientDateTimeProps = {
  date: Date | string;
};

/**
 * Formats a date only after mount so server HTML matches the initial client render.
 */
export function ClientDateTime({ date }: ClientDateTimeProps) {
  const [formatted, setFormatted] = useState<string | null>(null);

  useEffect(() => {
    setFormatted(dateToDatetimeString(date));
  }, [date]);

  if (!formatted) {
    return null;
  }

  return <span>{formatted}</span>;
}
