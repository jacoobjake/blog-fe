import { useNode } from "@craftjs/core";
import { buttonVariants, cn } from "@heroui/react";
import { ButtonElementSettings } from "./settings";
import type { ButtonElementProps } from "./types";

export type { ButtonElementProps } from "./types";

export const ButtonElement = ({
  label,
  onClick,
  size,
  variant,
  color,
  className,
}: ButtonElementProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <button
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      onClick={onClick}
      className={cn(
        buttonVariants({
          size,
          variant,
        }),
        className,
      )}
      style={{ color }}
    >
      {label}
    </button>
  );
};

ButtonElement.craft = {
  displayName: "Button",
  props: {
    label: "Button",
    size: "md",
    variant: "primary",
  },
  related: {
    settings: ButtonElementSettings,
  },
};
