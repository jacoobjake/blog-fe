import { createStore } from "zustand";
import { ThemeState, ThemeStore } from "./types";
import { persist } from "zustand/middleware"; 

export const defaultInitState: ThemeState = {
  theme: "light",
}

export const createThemeStore = (
  initState: ThemeState = defaultInitState,
) => {
  return createStore<ThemeStore>()(
    persist(
      (set) => ({
        ...initState,
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: "theme-storage",
      }
    )
  )
}