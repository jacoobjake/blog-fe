"use client";

import { useThemeStore } from "@/hooks";
import { Button, cn } from "@heroui/react";
import { useEffect } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeSwitch() {
  const { theme, setTheme } = useThemeStore((state) => state);
  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Button
      onClick={handleThemeChange}
      className="relative focus:ring-0 bg-transparent text-accent transition-all duration-100 hover:bg-accent-soft-hover cursor-pointer"
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
