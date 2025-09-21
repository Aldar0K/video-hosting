"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme !== "light"; // default dark

  const handleToggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-transparent text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
      aria-label="Переключить тему"
      title="Переключить тему"
    >
      <Sun className="h-[1.1rem] w-[1.1rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.1rem] w-[1.1rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export default ThemeToggle;


