"use client";

import { useNode, Element, UserComponent } from "@craftjs/core";
import { BlogHeaderElement } from "../blog-header";
import { TextElement } from "../text";
import { ContainerElement } from "../container";
import type { AuthorProfile } from "@/lib/types";

export type RootCanvasProps = {
  defaultAuthorProfile?: AuthorProfile | null;
  children?: React.ReactNode;
};

export const RootCanvas: UserComponent<RootCanvasProps> = ({
  defaultAuthorProfile,
  children,
}) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <div
      ref={(ref) => {
        if (ref) connect(ref);
      }}
      className="bg-background w-full"
    >
      {/* Non-deletable blog header */}
      <Element
        id="blog-header"
        is={BlogHeaderElement}
        canvas={false}
        title="Untitled Blog Post"
        author_profile_id={
          defaultAuthorProfile ? Number(defaultAuthorProfile.id) : undefined
        }
        author_name={defaultAuthorProfile?.name || "Anonymous"}
        author_bio={defaultAuthorProfile?.bio || ""}
        is_published={false}
        tags={[]}
        created_at=""
      />

      {/* Content area */}
      <Element id="blog-content" is={ContainerElement} padding={20} canvas>
        <TextElement text="Start writing your blog content here..." />
        {children}
      </Element>
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
