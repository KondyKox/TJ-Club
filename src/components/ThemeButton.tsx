"use client";

import React from "react";
import Button from "./Button";
import useDarkMode from "@/hooks/useDarkMode";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

/**
 * ThemeButton component
 *
 * This button toggles between dark & light mode using the `useDarkMode` hook.
 * Depending on the current mode, it displays either the SunIcon (for dark mode)
 * or MoonIcon (for light mode).
 *
 * @returns {JSX.Element} A button component to toggle between dark & light mode.
 */

const ThemeButton: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <Button
      onClick={toggleDarkMode}
      noHover={true}
      className="z-50 fixed bottom-4 right-4 !p-4 rounded-full hover:bg-light hover:drop-shadow-dark dark:hover:drop-shadow-light dark:hover:bg-dark 
                    shadow-lg overflow-hidden dark:hover:!border-3 dark:hover:!border-light transition-all"
    >
      <div className="flex items-center justify-center">
        {darkMode ? (
          <SunIcon className="w-6 h-6 text-light transition-transform duration-300 ease-in-out hover:scale-125" />
        ) : (
          <MoonIcon className="w-6 h-6 text-dark transition-transform duration-300 ease-in-out hover:scale-125" />
        )}
      </div>
    </Button>
  );
};

export default ThemeButton;
