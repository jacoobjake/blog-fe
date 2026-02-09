"use client";

import { cn, Link as HeroLink, LinkProps } from "@heroui/react";

export default function Link({
  className,
  children,
  ...props
}: LinkProps) {
  return (
    <HeroLink
      className={cn("text-accent underline hover:text-accent/80", className)}
      {...props}
    >
      {children}
    </HeroLink>
  );
}
