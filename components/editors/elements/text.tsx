import { ColorPickerField } from "@/components/forms/fields/color-picker";
import { useEditor, useNode } from "@craftjs/core";
import {
  cn,
  Input,
  Label,
  parseColor,
  Surface,
  TextField,
} from "@heroui/react";
import { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import DOMPurify from "dompurify";

export type TextElementProps = {
  text: string;
  fontSize?: string | number;
  color?: string;
};

export const TextElement = ({
  text,
  fontSize = 12,
  color = "#000000", // Black in hex format
}: TextElementProps) => {
  const {
    actions: { setProp },
    connectors: { connect, drag },
    selected,
    dragged,
  } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
  }));
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (!selected) setEditable(false);
    else if (selected && enabled && !dragged) setEditable(true);
  }, [selected, enabled, dragged]);

  // Sanitize HTML to allow only safe formatting tags
  const sanitizeHtml = (html: string) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["b", "i", "em", "strong", "u", "s", "sup", "sub", "br"],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
    });
  };

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
    >
      <ContentEditable
        disabled={!editable}
        html={text}
        onChange={(e) =>
          setProp((props: TextElementProps) => {
            props.text = sanitizeHtml(e.target.value);
          })
        }
        tagName="p"
        style={{ fontSize: `${fontSize}px`, color }}
      />
    </div>
  );
};

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

TextElement.craft = {
  displayName: "TextElement",
  props: {
    text: "Text Element",
    fontSize: 12,
    color: "#000000", // Black in hex format
  },
  related: {
    settings: TextElementSettings,
  },
};
