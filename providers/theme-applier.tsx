"use client";

import { applyTheme } from "@/lib/utils/theme";
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

  return null;
}
