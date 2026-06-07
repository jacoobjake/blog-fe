import { ColorPickerField } from "@/components/forms/fields/color-picker";
import { useNode } from "@craftjs/core";
import { Input, Label, parseColor, Surface, TextField } from "@heroui/react";
import type { TextElementProps } from "./types";

export const TextElementSettings = () => {
  const {
    actions: { setProp },
    fontSize,
    color,
  } = useNode((node) => ({
    fontSize: node.data.props.fontSize,
    color: node.data.props.color,
  }));

  return (
    <Surface className="space-y-4">
      <TextField type="number">
        <Label>Font Size</Label>
        <Input
          value={fontSize}
          onChange={(e) =>
            setProp(
              (props: TextElementProps) => (props.fontSize = e.target.value),
            )
          }
        />
      </TextField>
      <TextField>
        <Label>Color</Label>
        <ColorPickerField
          color={parseColor(color)}
          setColor={(c) =>
            setProp(
              (props: TextElementProps) => (props.color = c.toString("css")),
            )
          }
        />
      </TextField>
    </Surface>
  );
};
