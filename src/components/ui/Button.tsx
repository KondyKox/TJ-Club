import ButtonProps from "@/types/ButtonProps";
import React from "react";

/**
 * Button component
 *
 * A reusable button component that supports various props such as:
 * - `onClick`: Function to execute on click
 * - `children`: The content inside the button (can be text or icons)
 * - 'loading': Boolean to show loading spinner
 * - `className`: Additional Tailwind CSS classes to style the button
 * - `disabled`: Boolean to disable the button
 * - `noHover`: Boolean to disable hover effects
 *
 * @param {Object} props The props for the Button component
 * @param {Function} [props.onClick] The function to call when the button is clicked.
 * @param {React.ReactNode} props.children The content inside the button.
 * @param {boolean} [props.loading] Whether to show loading spinner.
 * @param {string} [props.className] Additional classes for styling the button.
 * @param {boolean} [props.disabled=false] Whether the button is disabled.
 * @param {boolean} [props.noHover=false] Whether to disable hover effects.
 *
 * @returns {JSX.Element} The Button component.
 */

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  loading = false,
  className = "",
  disabled = false,
  noHover = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-none rounded flex justify-center items-center ${
        noHover
          ? ""
          : "hover:bg-button hover:scale-125 hover:drop-shadow-button"
      } transition duration-300 ease-in-out ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-1">
          <span className="h-2 w-2 bg-current rounded-full animate-dots-1"></span>
          <span className="h-2 w-2 bg-current rounded-full animate-dots-2"></span>
          <span className="h-2 w-2 bg-current rounded-full animate-dots-3"></span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
