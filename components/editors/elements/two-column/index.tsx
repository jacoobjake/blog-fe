"use client";

import { Element, useEditor, useNode, UserComponent } from "@craftjs/core";
import { cn } from "@heroui/react";
import { useRef } from "react";
import { ContainerElement } from "../container";
import { ColumnResizeHandle } from "./column-resize-handle";
import { TwoColumnSettings } from "./settings";
import type { TwoColumnElementProps } from "./types";

export type { TwoColumnElementProps } from "./types";

export const TwoColumnElement: UserComponent<TwoColumnElementProps> = ({
  leftWidthPercent = 50,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const {
    connectors: { connect, drag },
  } = useNode();

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const clampedLeft = Math.min(80, Math.max(20, leftWidthPercent));

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className="w-full my-4"
      style={
        {
          "--left-col": `${clampedLeft}%`,
        } as React.CSSProperties
      }
    >
      <div
        ref={rowRef}
        className={cn(
          "relative w-full",
          "flex flex-col md:flex-row md:items-stretch",
        )}
      >
        <div className="min-w-0 w-full md:w-[var(--left-col)] md:flex-none">
          <Element id="left-column" is={ContainerElement} padding={16} canvas />
        </div>

        <div className="min-w-0 w-full md:flex-1">
          <Element
            id="right-column"
            is={ContainerElement}
            padding={16}
            canvas
          />
        </div>

        {enabled && (
          <ColumnResizeHandle rowRef={rowRef} leftPercent={clampedLeft} />
        )}
      </div>
    </div>
  );
};

TwoColumnElement.craft = {
  displayName: "Two Columns",
  props: {
    leftWidthPercent: 50,
  },
  rules: {
    canMoveIn: () => false,
  },
  related: {
    settings: TwoColumnSettings,
  },
};
