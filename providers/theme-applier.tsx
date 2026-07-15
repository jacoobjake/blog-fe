"use client";

import { applyTheme, isTheme, readStoredTheme } from "@/lib/utils/theme";
import { THEME_STORAGE_KEY } from "@/constants";
import { createThemeStore } from "@/stores";
import { useEffect, useState } from "react";
import { useStore } from "zustand";

type ThemeStoreApi = ReturnType<typeof createThemeStore>;

export function ThemeApplier({ store }: { store: ThemeStoreApi }) {
  const theme = useStore(store, (state) => state.theme);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const persistApi = store.persist;

    const markHydrated = () => {
      setHasHydrated(true);
      applyTheme(store.getState().theme);
    };

    if (!persistApi) {
      markHydrated();
      return;
    }

    if (persistApi.hasHydrated()) {
      markHydrated();
      return;
    }

    return persistApi.onFinishHydration(markHydrated);
  }, [store]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    applyTheme(theme);
  }, [theme, hasHydrated]);

  // Keep theme + icon in sync when another tab changes localStorage.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY || event.newValue == null) {
        return;
      }

      try {
        const parsed = JSON.parse(event.newValue) as {
          state?: { theme?: unknown };
        };
        const nextTheme = parsed.state?.theme;
        if (!isTheme(nextTheme) || nextTheme === store.getState().theme) {
          return;
        }

        store.setState({ theme: nextTheme });
        applyTheme(nextTheme);
      } catch {
        // Ignore invalid storage payloads.
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [store]);

  // Align with localStorage if cookie/dom lagged behind another tab's write.
  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const stored = readStoredTheme();
    if (stored && stored !== store.getState().theme) {
      store.setState({ theme: stored });
      applyTheme(stored);
    }
  }, [hasHydrated, store]);

  return null;
}
