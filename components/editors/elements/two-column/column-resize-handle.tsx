"use client";

import { useNode } from "@craftjs/core";
import { useCallback, useRef } from "react";
import type { TwoColumnElementProps } from "./types";

const MIN_PERCENT = 20;
const MAX_PERCENT = 80;

export function ColumnResizeHandle() {
  const rowRef = useRef<HTMLDivElement>(null);
  const {
    actions: { setProp },
  } = useNode();

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const row = rowRef.current?.parentElement;
      if (!row) return;

      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);

      const updateWidth = (clientX: number) => {
        const rect = row.getBoundingClientRect();
        const percent = ((clientX - rect.left) / rect.width) * 100;
        const clamped = Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, percent));

        setProp((props: TwoColumnElementProps) => {
          props.leftWidthPercent = Math.round(clamped);
        });
      };

      updateWidth(event.clientX);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        updateWidth(moveEvent.clientX);
      };

      const handlePointerUp = () => {
        event.currentTarget.releasePointerCapture(event.pointerId);
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    },
    [setProp],
  );

  return (
    <div
      ref={rowRef}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize columns"
      className="hidden md:flex w-3 shrink-0 cursor-col-resize items-center justify-center group"
      onPointerDown={handlePointerDown}
    >
      <div className="h-16 w-1 rounded-full bg-separator group-hover:bg-accent transition-colors" />
    </div>
  );
}
