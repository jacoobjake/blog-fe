"use client";

import { type ReactNode, createContext, useState } from "react";

import { createThemeStore } from "@/stores";
import { ThemeState } from "@/stores/types";

type ThemeStoreApi = ReturnType<typeof createThemeStore>;

export const ThemeContext = createContext<ThemeStoreApi | undefined>(undefined);

type ThemeStoreProviderProps = {
  children: ReactNode;
  initialState?: ThemeState;
};

export const ThemeContextProvider = ({
  children,
  initialState,
}: ThemeStoreProviderProps) => {
  const [store] = useState(() => createThemeStore(initialState));

  return <ThemeContext value={store}>{children}</ThemeContext>;
};
