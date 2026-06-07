import { useNode } from "@craftjs/core";
import { cn, surfaceVariants } from "@heroui/react";
import { ContainerSettings } from "./settings";
import type { ContainerElementProps } from "./types";

export type { ContainerElementProps } from "./types";

export const ContainerElement = ({
  children,
  variant,
  backgroundColor,
  padding,
  className,
}: ContainerElementProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      className={cn(surfaceVariants({ variant }), className)}
      style={{ backgroundColor, padding }}
    >
      {children}
    </div>
  );
};

ContainerElement.craft = {
  displayName: "Container",
  props: {
    padding: 0,
    backgroundColor: "#ffffff", // White background
  },
  related: {
    settings: ContainerSettings,
  },
};
