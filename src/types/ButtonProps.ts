import { ReactNode } from "react";

export default interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  noHover?: boolean;
}
