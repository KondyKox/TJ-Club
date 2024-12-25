import ButtonProps from "@/types/ButtonProps";
import React from "react";

/**
 * Button component
 *
 * A reusable button component that supports various props such as:
 * - `type`: The button type (button, submit, reset)
 * - `onClick`: Function to execute on click
 * - `children`: The content inside the button (can be text or icons)
 * - `className`: Additional Tailwind CSS classes to style the button
 * - `disabled`: Boolean to disable the button
 * - `noHover`: Boolean to disable hover effects
 *
 * @param {Object} props The props for the Button component
 * @param {"button" | "submit" | "reset"} [props.type="button"] The type of button (default is "button").
 * @param {Function} [props.onClick] The function to call when the button is clicked.
 * @param {React.ReactNode} props.children The content inside the button.
 * @param {string} [props.className] Additional classes for styling the button.
 * @param {boolean} [props.disabled=false] Whether the button is disabled.
 * @param {boolean} [props.noHover=false] Whether to disable hover effects.
 *
 * @returns {JSX.Element} The Button component.
 */

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = "",
  disabled = false,
  noHover = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-none rounded ${
        noHover
          ? ""
          : "hover:bg-button hover:scale-125 hover:drop-shadow-button"
      } transition duration-300 ease-in-out ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
