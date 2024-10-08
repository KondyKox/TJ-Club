import { ReactNode } from "react";

export default interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  noHover?: boolean;
}
