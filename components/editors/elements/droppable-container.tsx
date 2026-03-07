import { ColorPickerField } from "@/components/forms/fields/color-picker";
import { Element, useEditor, useNode, UserComponent } from "@craftjs/core";
import {
  cn,
  Label,
  parseColor,
  Surface,
  SurfaceProps,
  surfaceVariants,
} from "@heroui/react";
import { TextElement } from "./text";
import { ContainerElement } from "./container";
import { getHighlightedClassNames, SELECTED_CLASS_NAMES } from "../utils";

export type DroppableContainerElementProps = {
  backgroundColor?: string;
  className?: string;
  variant?: SurfaceProps["variant"];
};

export const DroppableContainerElement: UserComponent<
  DroppableContainerElementProps
> = ({ backgroundColor, className, variant }) => {
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
      style={{ backgroundColor }}
    >
      {/* Canvas area for dropping elements */}
      <Element id="drop-area" is={ContainerElement} canvas padding={20}>
        <TextElement text="Drop elements here..." fontSize={14} />
      </Element>
    </div>
  );
};

export const DroppableContainerSettings = () => {
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
      <Label>Background Color</Label>
      <ColorPickerField
        color={parseColor(backgroundColor || defaultColor)}
        setColor={(color) =>
          setProp((props: DroppableContainerElementProps) => {
            props.backgroundColor = color.toString("css");
          })
        }
      />
    </Surface>
  );
};

DroppableContainerElement.craft = {
  displayName: "Droppable Container",
  props: {
    backgroundColor: "#ffffff",
  },
  related: {
    settings: DroppableContainerSettings,
  },
};
