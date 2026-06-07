import { ColorPickerField } from "@/components/forms/fields/color-picker";
import { useNode } from "@craftjs/core";
import { Input, Label, parseColor, Surface, TextField } from "@heroui/react";
import type { ContainerElementProps } from "./types";

export const ContainerSettings = () => {
  const {
    backgroundColor,
    padding,
    actions: { setProp },
  } = useNode((node) => ({
    backgroundColor: node.data.props.backgroundColor,
    padding: node.data.props.padding,
  }));

  // Default to white if no background is set
  const defaultColor = "#ffffff";

  return (
    <Surface className="space-y-4">
      <ColorPickerField
        color={parseColor(backgroundColor || defaultColor)}
        setColor={(color) =>
          setProp((props: ContainerElementProps) => {
            props.backgroundColor = color.toString("css");
          })
        }
      />
      <TextField type="number">
        <Label>Padding</Label>
        <Input
          type="number"
          value={padding}
          onChange={(e) =>
            setProp((props: ContainerElementProps) => {
              props.padding = Number(e.target.value);
            })
          }
        />
      </TextField>
    </Surface>
  );
};
