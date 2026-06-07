import { ButtonProps } from "@heroui/react";

export type ButtonElementProps = {
  label: string;
  onClick?: () => void;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  color?: string;
  className?: string;
};
