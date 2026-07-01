"use client";

import { useRef } from "react";
import { Label } from "@heroui/react";

type ImagePositionPickerProps = {
  src: string;
  value?: string;
  height?: number;
  scale?: number;
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
  onChange,
}: ImagePositionPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y } = parsePosition(value);
  const imageScale = Math.min(3, Math.max(0.5, scale));

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
        className="relative w-full overflow-hidden rounded-lg border border-separator cursor-crosshair select-none"
        style={{ height }}
        onPointerDown={(e) => {
          containerRef.current?.setPointerCapture(e.pointerId);
          updatePosition(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (!containerRef.current?.hasPointerCapture(e.pointerId)) return;
          updatePosition(e.clientX, e.clientY);
        }}
        onPointerUp={(e) => {
          containerRef.current?.releasePointerCapture(e.pointerId);
        }}
      >
        <img
          src={src}
          alt="Position preview"
          className="w-full h-full object-cover pointer-events-none"
          style={{
            objectPosition: value,
            transform: `scale(${imageScale})`,
            transformOrigin: value,
          }}
          draggable={false}
        />
        <span
          className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md bg-accent/80 pointer-events-none"
          style={{ left: x, top: y }}
        />
      </div>
    </div>
  );
}
