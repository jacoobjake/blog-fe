import { COOKIE_NAME, THEME_STORAGE_KEY } from "@/constants";
import type { Theme } from "@/lib/types";

const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;

  try {
    document.cookie = `${COOKIE_NAME.THEME}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
  } catch {
    // Ignore cookie write failures (e.g. restricted environments).
  }
}

export function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as { state?: { theme?: Theme } };
    return parsed.state?.theme ?? null;
  } catch {
    return null;
  }
}

export function resolveInitialTheme(): Theme {
  const storedTheme = readStoredTheme();
  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}
