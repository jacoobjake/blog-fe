import { useEditor, useNode, UserComponent } from "@craftjs/core";
import { cn, Input, Label, Surface, TextField } from "@heroui/react";

export type SpacerElementProps = {
  height?: number;
  className?: string;
};

export const SpacerElement: UserComponent<SpacerElementProps> = ({
  height = 40,
  className,
}) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  // Show visual indicators only when editor is enabled and element is selected
  const showIndicators = enabled && selected;

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      className={cn(
        showIndicators && "border border-dashed border-separator bg-surface/50",
        className,
      )}
      style={{ height: `${height}px` }}
    >
      {showIndicators && (
        <div className="flex items-center justify-center h-full text-xs text-muted">
          {height}px
        </div>
      )}
    </div>
  );
};

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

SpacerElement.craft = {
  displayName: "Spacer",
  props: {
    height: 40,
  },
  related: {
    settings: SpacerSettings,
  },
};
