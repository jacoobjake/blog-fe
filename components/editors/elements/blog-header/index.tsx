"use client";

import { useNode, UserComponent } from "@craftjs/core";
import { cn } from "@heroui/react";
import { BlogHeaderSettings } from "./settings";
import type { BlogHeaderElementProps } from "./types";

export type { BlogHeaderElementProps } from "./types";

const defaultProps: Partial<BlogHeaderElementProps> = {
  title: "Untitled Blog Post",
  description: "",
  author: "Anonymous",
  tags: [],
};

export const BlogHeaderElement: UserComponent<BlogHeaderElementProps> = ({
  title,
  description,
  author,
  is_published,
  tags = [],
}) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <header
      ref={(ref) => {
        if (ref) connect(ref);
      }}
      className={cn("mb-8 pb-6 border-b border-separator")}
    >
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-4xl font-bold">{title}</h1>
        {is_published && (
          <span className="px-3 py-1 bg-success/10 text-success text-sm rounded-md">
            Published
          </span>
        )}
      </div>
      {description && <p className="text-lg text-muted mb-4">{description}</p>}
      <div className="flex items-center gap-4 text-sm text-muted">
        <span>By {author}</span>
        {tags && tags.length > 0 && (
          <div className="flex gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-surface-secondary rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

BlogHeaderElement.craft = {
  displayName: "Blog Header",
  props: defaultProps,
  rules: {
    canDrag: () => false,
    canDrop: () => false,
    canMoveIn: () => false,
    canMoveOut: () => false,
  },
  related: {
    settings: BlogHeaderSettings,
  },
};
