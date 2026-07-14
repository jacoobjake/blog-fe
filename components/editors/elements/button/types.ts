import { ButtonProps } from "@heroui/react";

export type ButtonElementProps = {
  label: string;
  href?: string;
  target?: "_blank" | "_self";
  onClick?: () => void;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  color?: string;
  className?: string;
};
