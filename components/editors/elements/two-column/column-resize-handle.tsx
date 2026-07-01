"use client";

import { useNode } from "@craftjs/core";
import { useCallback, useRef } from "react";
import type { TwoColumnElementProps } from "./types";

const MIN_PERCENT = 20;
const MAX_PERCENT = 80;

export function ColumnResizeHandle() {
  const handleRef = useRef<HTMLDivElement>(null);
  const {
    actions: { setProp },
  } = useNode();

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const row = handleRef.current?.parentElement;
      const handle = handleRef.current;
      if (!row || !handle) return;

      event.preventDefault();
      event.stopPropagation();

      const pointerId = event.pointerId;
      handle.setPointerCapture(pointerId);

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
        if (handle.hasPointerCapture(pointerId)) {
          handle.releasePointerCapture(pointerId);
        }
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
      ref={handleRef}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize columns"
      className="hidden md:block relative w-3 shrink-0 self-stretch cursor-col-resize group"
      onPointerDown={handlePointerDown}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-separator group-hover:bg-accent transition-colors" />
    </div>
  );
}
