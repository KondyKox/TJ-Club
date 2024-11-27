import { ReactNode } from "react";

export default interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  noHover?: boolean;
}
