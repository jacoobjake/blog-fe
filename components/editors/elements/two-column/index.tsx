"use client";

import { Element, useEditor, useNode, UserComponent } from "@craftjs/core";
import { cn } from "@heroui/react";
import { ContainerElement } from "../container";
import { ColumnResizeHandle } from "./column-resize-handle";
import { TwoColumnSettings } from "./settings";
import type { TwoColumnElementProps } from "./types";

export type { TwoColumnElementProps } from "./types";

export const TwoColumnElement: UserComponent<TwoColumnElementProps> = ({
  leftWidthPercent = 50,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const clampedLeft = Math.min(80, Math.max(20, leftWidthPercent));
  const rightWidthPercent = 100 - clampedLeft;

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className="w-full my-4"
      style={
        {
          "--left-col": `${clampedLeft}%`,
          "--right-col": `${rightWidthPercent}%`,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "flex gap-0",
          "flex-col md:flex-row md:items-stretch",
        )}
      >
        <div className="min-w-0 w-full md:w-[var(--left-col)] md:flex-none">
          <Element id="left-column" is={ContainerElement} padding={16} canvas />
        </div>

        {enabled && <ColumnResizeHandle />}

        <div className="min-w-0 w-full md:w-[var(--right-col)] md:flex-none">
          <Element
            id="right-column"
            is={ContainerElement}
            padding={16}
            canvas
          />
        </div>
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
