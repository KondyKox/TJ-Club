import { useEffect, useState } from "react";

const THEME_KEY = "TJ_THEME";

/**
 * Custom hook to manage dark mode functionality based on user preferences
 *
 * The hook checks for stored theme preferences in localStorage. If no preference
 * is found, it falls back to the system-level preference (using `prefers-color-scheme`).
 *
 * @returns {Object} An object containing the current `darkMode` state and a `toggleDarkMode` function.
 */

const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  });

  useEffect(() => {
    if (!isMounted) return;

    const storedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Apply dark mode if system preference is dark or stored theme is dark
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, [isMounted]);

  /**
   * Toggles between dark & light mode.
   *
   * This function updates both the document class and stores the user's preference
   * in localStorage.
   */
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem(THEME_KEY, "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem(THEME_KEY, "dark");
      setDarkMode(true);
    }
  };

  return { darkMode, toggleDarkMode };
};

export default useDarkMode;
