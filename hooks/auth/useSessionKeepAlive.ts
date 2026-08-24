"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { authApi } from "@/lib/apis/browser";

const KEEP_ALIVE_INTERVAL_MS = 5 * 60 * 1000;

export function useSessionKeepAlive() {
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const ping = async () => {
      if (document.visibilityState !== "visible") return;

      try {
        await authApi.me();
      } catch {
        router.push("/admin/login");
      }
    };

    const startInterval = () => {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(() => {
        void ping();
      }, KEEP_ALIVE_INTERVAL_MS);
    };

    const stopInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void ping();
        startInterval();
        return;
      }

      stopInterval();
    };

    if (document.visibilityState === "visible") {
      startInterval();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopInterval();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);
}
