"use client";

import { useRef } from "react";
import { Label } from "@heroui/react";
import { ImageFrame } from "@/components/editors/shared/image-frame";

type ImagePositionPickerProps = {
  src: string;
  value?: string;
  height?: number;
  scale?: number;
  intrinsicWidth?: number;
  intrinsicHeight?: number;
  onChange: (position: string) => void;
};

function parsePosition(value?: string) {
  const [x = "50%", y = "50%"] = (value ?? "50% 50%").split(" ");
  return { x, y };
}

export function ImagePositionPicker({
  src,
  value = "50% 50%",
  height = 280,
  scale = 1,
  intrinsicWidth,
  intrinsicHeight,
  onChange,
}: ImagePositionPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y } = parsePosition(value);

  const updatePosition = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const nextX = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100),
    );
    const nextY = Math.max(
      0,
      Math.min(100, ((clientY - rect.top) / rect.height) * 100),
    );

    onChange(`${nextX.toFixed(1)}% ${nextY.toFixed(1)}%`);
  };

  return (
    <div className="space-y-2">
      <Label>Image position</Label>
      <p className="text-xs text-muted">
        Click or drag inside the frame to set the focal point.
      </p>
      <div
        ref={containerRef}
        className="relative w-full rounded-lg border border-separator cursor-crosshair select-none"
        style={{ height }}
        onPointerDown={(e) => {
          const container = containerRef.current;
          if (!container) return;

          const pointerId = e.pointerId;
          container.setPointerCapture(pointerId);
          updatePosition(e.clientX, e.clientY);

          const handlePointerMove = (moveEvent: PointerEvent) => {
            if (!container.hasPointerCapture(pointerId)) return;
            updatePosition(moveEvent.clientX, moveEvent.clientY);
          };

          const handlePointerUp = () => {
            if (container.hasPointerCapture(pointerId)) {
              container.releasePointerCapture(pointerId);
            }
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
          };

          window.addEventListener("pointermove", handlePointerMove);
          window.addEventListener("pointerup", handlePointerUp);
        }}
      >
        <ImageFrame
          src={src}
          alt="Position preview"
          height={height}
          objectPosition={value}
          scale={scale}
          intrinsicWidth={intrinsicWidth}
          intrinsicHeight={intrinsicHeight}
          className="rounded-lg pointer-events-none"
        />
        <span
          className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md bg-accent/80 pointer-events-none"
          style={{ left: x, top: y }}
        />
      </div>
    </div>
  );
}
