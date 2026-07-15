"use client";

import { useThemeStore } from "@/hooks";
import { Button, cn } from "@heroui/react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeSwitch({ className }: { className?: string }) {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isLight = theme === "light";

  return (
    <Button
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      onClick={handleThemeChange}
      isIconOnly
      className={cn(
        "relative focus:ring-0 bg-transparent text-foreground transition-all duration-100 hover:bg-accent-soft-hover cursor-pointer",
        className,
      )}
    >
      <span className="relative flex size-5 items-center justify-center" suppressHydrationWarning>
        <FiMoon
          className={cn(
            "absolute inset-0 m-auto transition-opacity duration-200",
            isLight ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={!isLight}
        />
        <FiSun
          className={cn(
            "absolute inset-0 m-auto transition-opacity duration-200",
            isLight ? "opacity-0" : "opacity-100",
          )}
          aria-hidden={isLight}
        />
      </span>
    </Button>
  );
}
