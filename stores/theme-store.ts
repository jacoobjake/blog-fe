import { THEME_STORAGE_KEY } from "@/constants";
import { createStore } from "zustand";

import type { ThemeState, ThemeStore } from "@/stores/types";
import { persist } from "zustand/middleware";

export const defaultInitState: ThemeState = {
  theme: "light",
};

export const createThemeStore = (initState: ThemeState = defaultInitState) => {
  return createStore<ThemeStore>()(
    persist(
      (set) => ({
        ...initState,
        setTheme: (theme) => set({ theme }),
      }),
      { name: THEME_STORAGE_KEY },
    ),
  );
};
