"use client";

import { useNode, Element, UserComponent } from "@craftjs/core";
import { BlogHeaderElement } from "./blog-header";
import { cn } from "@heroui/styles";
import { getHighlightedClassNames, SELECTED_CLASS_NAMES } from "../utils";

export type RootCanvasProps = {
  children?: React.ReactNode;
};

export const RootCanvas: UserComponent<RootCanvasProps> = ({ children }) => {
  const {
    connectors: { connect },
    hasSelectedNode,
  } = useNode((state) => ({
    hasSelectedNode: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => {
        if (ref) connect(ref);
      }}
      className={cn(
        "bg-background p-8",
        getHighlightedClassNames(hasSelectedNode),
      )}
    >
      <div className="max-w-4xl mx-auto">
        {/* Non-deletable blog header */}
        <Element
          id="blog-header"
          is={BlogHeaderElement}
          canvas={false}
          title="Untitled Blog Post"
          author="Anonymous"
          is_published={false}
          tags={[]}
        />

        {/* Content area */}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

RootCanvas.craft = {
  displayName: "Root Canvas",
  rules: {
    canDrag: () => false,
    canDrop: () => false,
    canMoveIn: () => true,
    canMoveOut: () => false,
  },
};
