"use client";

import { useEditor, useNode, UserComponent } from "@craftjs/core";
import { cn } from "@heroui/react";
import { useEffect } from "react";
import { ClientDateTime } from "@/components/ui/client-datetime";
import { BlogHeaderSettings } from "./settings";
import type { BlogHeaderElementProps } from "./types";

export type { BlogHeaderElementProps } from "./types";

const defaultProps: Partial<BlogHeaderElementProps> = {
  title: "Untitled Blog Post",
  description: "",
  author: "Anonymous",
  tags: [],
  created_at: "",
  hero_object_position: "50% 50%",
};

export const BlogHeaderElement: UserComponent<BlogHeaderElementProps> = ({
  title,
  description,
  author,
  is_published,
  tags = [],
  created_at,
  hero_src,
  hero_object_position = "50% 50%",
}) => {
  const {
    connectors: { connect },
    actions: { setProp },
  } = useNode();

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

  useEffect(() => {
    if (!created_at && enabled) {
      setProp((props: BlogHeaderElementProps) => {
        props.created_at = new Date().toISOString();
      });
    }
  }, [created_at, enabled, setProp]);

  return (
    <header
      ref={(ref) => {
        if (ref) connect(ref);
      }}
      className={cn("mb-8 pb-6 border-b border-separator")}
    >
      {hero_src && (
        <div className="w-full aspect-[21/9] overflow-hidden rounded-xl mb-6">
          <img
            src={hero_src}
            alt={title}
            className="w-full h-full object-cover"
            style={{ objectPosition: hero_object_position }}
          />
        </div>
      )}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-4xl font-bold">{title}</h1>
        {enabled && is_published && (
          <span className="px-3 py-1 bg-success/10 text-success text-sm rounded-md">
            Published
          </span>
        )}
      </div>
      {description && <p className="text-lg text-muted mb-4">{description}</p>}
      <div className="flex items-center gap-4 text-sm text-muted mb-2">
        <span>By {author}</span>
      </div>
      {created_at && (
        <div className="flex items-center gap-4 text-xs text-muted/70 mb-2">
          <ClientDateTime date={created_at} />
        </div>
      )}
      {tags && tags.length > 0 && (
        <div className="flex gap-1">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-2 bg-accent rounded-full text-xs text-accent-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
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
