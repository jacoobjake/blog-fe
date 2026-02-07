export type Theme = "light" | "dark";

export type ThemeState = {
    theme: Theme;
}

export type ThemeActions = {
    setTheme: (theme: Theme) => void;
}

export type ThemeStore = ThemeState & ThemeActions;