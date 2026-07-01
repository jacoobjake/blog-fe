"use client";

import { useNode } from "@craftjs/core";
import { useCallback, useRef, type RefObject } from "react";
import type { TwoColumnElementProps } from "./types";

const MIN_PERCENT = 20;
const MAX_PERCENT = 80;

type ColumnResizeHandleProps = {
  rowRef: RefObject<HTMLDivElement | null>;
  leftPercent: number;
};

export function ColumnResizeHandle({
  rowRef,
  leftPercent,
}: ColumnResizeHandleProps) {
  const handleRef = useRef<HTMLDivElement>(null);
  const {
    actions: { setProp },
  } = useNode();

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const row = rowRef.current;
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
    [rowRef, setProp],
  );

  return (
    <div
      ref={handleRef}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize columns"
      aria-valuenow={leftPercent}
      aria-valuemin={MIN_PERCENT}
      aria-valuemax={MAX_PERCENT}
      className="hidden md:flex absolute top-0 bottom-0 z-10 w-4 -translate-x-1/2 cursor-col-resize items-center justify-center group"
      style={{ left: `${leftPercent}%` }}
      onPointerDown={handlePointerDown}
    >
      <div className="h-16 w-1 rounded-full bg-separator group-hover:bg-accent transition-colors" />
    </div>
  );
}
