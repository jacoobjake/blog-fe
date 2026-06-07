import { SurfaceProps } from "@heroui/react";

export type ContainerElementProps = {
  children?: React.ReactNode;
  variant?: SurfaceProps["variant"];
  backgroundColor?: string;
  padding?: number;
  className?: string;
};
