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
      className="z-50 fixed bottom-4 right-4 !p-4 rounded-full hover:bg-primary hover:drop-shadow-interaction shadow-lg overflow-hidden transition-all"
    >
      <div className="flex items-center justify-center">
        {darkMode ? (
          <SunIcon className="theme-button-icon" />
        ) : (
          <MoonIcon className="theme-button-icon" />
        )}
      </div>
    </Button>
  );
};

export default ThemeButton;
