"use client";

import { Link as HeroLink, LinkProps } from "@heroui/react";

export default function Link({ children, ...props }: LinkProps) {
  return <HeroLink {...props}>{children}</HeroLink>;
}
