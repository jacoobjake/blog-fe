"use client";

import { useNode } from "@craftjs/core";
import { Input, Label, Surface, TextField } from "@heroui/react";
import type { TwoColumnElementProps } from "./types";

export const TwoColumnSettings = () => {
  const {
    leftWidthPercent,
    actions: { setProp },
  } = useNode((node) => ({
    leftWidthPercent: node.data.props.leftWidthPercent as number,
  }));

  return (
    <Surface className="space-y-4">
      <TextField>
        <Label>Left column width (%)</Label>
        <Input
          type="number"
          min={20}
          max={80}
          value={leftWidthPercent ?? 50}
          onChange={(e) =>
            setProp((props: TwoColumnElementProps) => {
              const value = Number(e.target.value);
              props.leftWidthPercent = Math.min(80, Math.max(20, value));
            })
          }
        />
      </TextField>
      <p className="text-xs text-muted">
        Drag the handle between columns on desktop, or adjust the percentage here.
        Columns stack on small screens.
      </p>
    </Surface>
  );
};
