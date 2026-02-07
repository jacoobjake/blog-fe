"use client";

import { type ReactNode, createContext, useState } from "react";

import { createThemeStore } from "@/stores";

export type ThemeStoreApi = ReturnType<typeof createThemeStore>;

export const ThemeContext = createContext<ThemeStoreApi | undefined>(undefined);

export interface ThemeStoreProviderProps {
  children: ReactNode;
}

export const ThemeContextProvider = ({ children }: ThemeStoreProviderProps) => {
  const [store] = useState(() => createThemeStore());

  return <ThemeContext value={store}>{children}</ThemeContext>;
};
