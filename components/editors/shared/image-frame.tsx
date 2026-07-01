"use client";

import { cn } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import {
  clampImageScale,
  computeCoverLayout,
  loadImageDimensions,
  parseObjectPosition,
} from "@/lib/utils/image-frame";

export type ImageFrameProps = {
  src: string;
  alt?: string;
  height: number;
  objectPosition?: string;
  scale?: number;
  intrinsicWidth?: number;
  intrinsicHeight?: number;
  className?: string;
};

export { clampImageScale } from "@/lib/utils/image-frame";

export function ImageFrame({
  src,
  alt = "",
  height,
  objectPosition = "50% 50%",
  scale = 1,
  intrinsicWidth,
  intrinsicHeight,
  className,
}: ImageFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [naturalWidth, setNaturalWidth] = useState(intrinsicWidth ?? 0);
  const [naturalHeight, setNaturalHeight] = useState(intrinsicHeight ?? 0);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(containerRef.current);
    setContainerWidth(containerRef.current.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (intrinsicWidth && intrinsicHeight) {
      setNaturalWidth(intrinsicWidth);
      setNaturalHeight(intrinsicHeight);
      return;
    }

    let cancelled = false;

    loadImageDimensions(src)
      .then(({ width, height: loadedHeight }) => {
        if (cancelled) return;
        setNaturalWidth(width);
        setNaturalHeight(loadedHeight);
      })
      .catch(() => {
        if (cancelled) return;
        setNaturalWidth(0);
        setNaturalHeight(0);
      });

    return () => {
      cancelled = true;
    };
  }, [src, intrinsicWidth, intrinsicHeight]);

  const imageScale = clampImageScale(scale);
  const { x: focalX, y: focalY } = parseObjectPosition(objectPosition);
  const layout = computeCoverLayout(
    containerWidth,
    height,
    naturalWidth,
    naturalHeight,
    imageScale,
    focalX,
    focalY,
  );

  const isReady = containerWidth > 0 && naturalWidth > 0 && naturalHeight > 0;

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden bg-accent/10", className)}
      style={{ height }}
      role="img"
      aria-label={alt || "Image"}
    >
      {isReady && (
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="absolute max-w-none select-none"
          style={{
            width: layout.width,
            height: layout.height,
            left: layout.left,
            top: layout.top,
          }}
        />
      )}
    </div>
  );
}
