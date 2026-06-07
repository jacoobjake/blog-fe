import { Theme } from "@/lib/types";

export type ThemeState = {
  theme: Theme;
};

export type ThemeActions = {
  setTheme: (theme: Theme) => void;
};

export type ThemeStore = ThemeState & ThemeActions;
