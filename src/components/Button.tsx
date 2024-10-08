import ButtonProps from "@/types/ButtonProps";
import React from "react";

const Button: React.FC<ButtonProps> = ({
  type = "button",
  onClick,
  children,
  className = "",
  disabled = false,
  noHover = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-none rounded ${
        noHover ? "" : "hover:bg-button hover:scale-125"
      } transition duration-300 ease-in-out ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
