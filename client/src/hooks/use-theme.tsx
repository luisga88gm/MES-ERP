import { useEffect, useState } from "react";

interface UseThemeReturn {
  theme: string;
  setTheme: (theme: string) => void;
}

export function useTheme(): UseThemeReturn {
  const [theme, setTheme] = useState(() => {
    // Check for stored theme preference or system default
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
