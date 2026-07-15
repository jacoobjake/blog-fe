import { THEME_STORAGE_KEY } from "@/constants";
import { isTheme } from "@/lib/utils/theme";
import { createStore } from "zustand";

import type { ThemeState, ThemeStore } from "@/stores/types";
import { persist } from "zustand/middleware";

export const defaultInitState: ThemeState = {
  theme: "light",
};

function getClientBootTheme(): ThemeState["theme"] {
  if (typeof document === "undefined") {
    return defaultInitState.theme;
  }

  const fromDom = document.documentElement.getAttribute("data-theme");
  return isTheme(fromDom) ? fromDom : defaultInitState.theme;
}

export const createThemeStore = (initState?: ThemeState) => {
  const state = initState ?? { theme: getClientBootTheme() };

  return createStore<ThemeStore>()(
    persist(
      (set) => ({
        ...state,
        setTheme: (theme) => set({ theme }),
      }),
      { name: THEME_STORAGE_KEY },
    ),
  );
};
