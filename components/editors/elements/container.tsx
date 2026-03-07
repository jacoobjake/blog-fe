import { ColorPickerField } from "@/components/forms/fields/color-picker";
import { useNode, UserComponent } from "@craftjs/core";
import {
  cn,
  Input,
  Label,
  parseColor,
  Surface,
  SurfaceProps,
  surfaceVariants,
  TextField,
} from "@heroui/react";
import { getHighlightedClassNames, SELECTED_CLASS_NAMES } from "../utils";

export type ContainerElementProps = {
  children?: React.ReactNode;
  variant?: SurfaceProps["variant"];
  backgroundColor?: string;
  padding?: number;
  className?: string;
};

export const ContainerElement = ({
  children,
  variant,
  backgroundColor,
  padding,
  className,
}: ContainerElementProps) => {
  const {
    connectors: { connect, drag },
    hasSelectedNode,
  } = useNode((state) => ({
    hasSelectedNode: state.events.selected,
  }));
  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      className={cn(
        surfaceVariants({ variant }),
        className,
        getHighlightedClassNames(hasSelectedNode),
      )}
      style={{ backgroundColor, padding }}
    >
      {children}
    </div>
  );
};

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

ContainerElement.craft = {
  displayName: "Container",
  props: {
    padding: 0,
    backgroundColor: "#ffffff", // White background
  },
  related: {
    settings: ContainerSettings,
  },
};
