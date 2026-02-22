"use client";

import { ThemeContext } from "@/providers/theme-provider";
import { type ThemeStore } from "@/stores/types";
import { useContext } from "react";
import { useStore } from "zustand";

export const useThemeStore = <T,>(selector: (store: ThemeStore) => T): T => {
  const themeStoreContext = useContext(ThemeContext);
  if (!themeStoreContext) {
    throw new Error(`useThemeStore must be used within ThemeStoreProvider`);
  }

  return useStore(themeStoreContext, selector);
};
