"use client";

import { useThemeStore } from "@/hooks";
import { Button, cn } from "@heroui/react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeSwitch({ className }: { className?: string }) {
  const { theme, setTheme } = useThemeStore((state) => state);

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      onClick={handleThemeChange}
      className={cn(
        "relative focus:ring-0 bg-transparent text-foreground transition-all duration-100 hover:bg-accent-soft-hover cursor-pointer",
        className,
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-0 w-full h-full transition-opacity duration-300 flex items-center justify-center",
          theme === "light" ? "opacity-100" : "opacity-0",
        )}
      >
        <FiMoon />
      </div>
      <div
        className={cn(
          "absolute left-0 top-0 w-full h-full transition-opacity duration-300 flex items-center justify-center",
          theme === "light" ? "opacity-0" : "opacity-100",
        )}
      >
        <FiSun />
      </div>
    </Button>
  );
}
