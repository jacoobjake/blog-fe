import { cn } from "@heroui/react";

export type ImageFrameProps = {
  src: string;
  alt?: string;
  height: number;
  objectPosition?: string;
  scale?: number;
  className?: string;
};

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

export function clampImageScale(scale: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

/**
 * Renders a cropped/zoomed image inside a fixed-height, full-width frame.
 *
 * Uses background-image with a width-relative background-size so the visible
 * crop scales with the container instead of jumping between breakpoints or
 * editor modes. The settings preview uses this same component for WYSIWYG.
 */
export function ImageFrame({
  src,
  alt = "",
  height,
  objectPosition = "50% 50%",
  scale = 1,
  className,
}: ImageFrameProps) {
  const imageScale = clampImageScale(scale);

  return (
    <div
      role="img"
      aria-label={alt || "Image"}
      className={cn("w-full overflow-hidden bg-accent/10", className)}
      style={{
        height,
        backgroundImage: `url(${src})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: objectPosition,
        backgroundSize: `${imageScale * 100}% auto`,
      }}
    />
  );
}
