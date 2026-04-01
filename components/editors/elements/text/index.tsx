import { useEditor, useNode } from "@craftjs/core";
import { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import DOMPurify from "dompurify";
import { TextElementSettings } from "./settings";
import type { TextElementProps } from "./types";

export type { TextElementProps } from "./types";

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
