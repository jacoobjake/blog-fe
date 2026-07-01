"use client";

import { useNode } from "@craftjs/core";
import { useEffect, useState } from "react";
import { Input, Label, Surface, TextField } from "@heroui/react";
import type { TwoColumnElementProps } from "./types";

const MIN_PERCENT = 20;
const MAX_PERCENT = 80;

function clampLeftWidth(value: number) {
  return Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, value));
}

export const TwoColumnSettings = () => {
  const {
    leftWidthPercent,
    actions: { setProp },
  } = useNode((node) => ({
    leftWidthPercent: node.data.props.leftWidthPercent as number,
  }));

  const currentWidth = leftWidthPercent ?? 50;
  const [widthDraft, setWidthDraft] = useState(String(currentWidth));

  useEffect(() => {
    setWidthDraft(String(currentWidth));
  }, [currentWidth]);

  const commitWidth = () => {
    const parsed = Number(widthDraft);
    const nextWidth = Number.isFinite(parsed)
      ? clampLeftWidth(parsed)
      : currentWidth;

    setProp((props: TwoColumnElementProps) => {
      props.leftWidthPercent = nextWidth;
    });
    setWidthDraft(String(nextWidth));
  };

  return (
    <Surface className="space-y-4">
      <TextField>
        <Label>Left column width (%)</Label>
        <Input
          type="number"
          inputMode="numeric"
          value={widthDraft}
          onChange={(e) => setWidthDraft(e.target.value)}
          onBlur={commitWidth}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commitWidth();
              e.currentTarget.blur();
            }
          }}
        />
      </TextField>
      <p className="text-xs text-muted">
        Drag the handle between columns on desktop, or adjust the percentage here.
        Columns stack on small screens.
      </p>
    </Surface>
  );
};
