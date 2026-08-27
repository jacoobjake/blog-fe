"use client";

import { useSessionKeepAlive } from "@/hooks/auth/useSessionKeepAlive";

export function SessionKeepAlive() {
  useSessionKeepAlive();
  return null;
}
