import { useNode } from "@craftjs/core";
import { Input, Label, Surface, TextField } from "@heroui/react";
import type { SpacerElementProps } from "./types";

export const SpacerSettings = () => {
  const {
    height,
    actions: { setProp },
  } = useNode((node) => ({
    height: node.data.props.height,
  }));

  return (
    <Surface className="space-y-4">
      <TextField type="number">
        <Label>Height (px)</Label>
        <Input
          type="number"
          value={height}
          onChange={(e) =>
            setProp((props: SpacerElementProps) => {
              props.height = Number(e.target.value);
            })
          }
        />
      </TextField>
    </Surface>
  );
};
