"use client";

import { useEditor, useNode, UserComponent } from "@craftjs/core";
import { cn } from "@heroui/react";
import { MdImage } from "react-icons/md";
import { AssetImageSettings } from "./settings";
import type { AssetImageElementProps } from "./types";

export type { AssetImageElementProps } from "./types";

const widthClasses: Record<NonNullable<AssetImageElementProps["width"]>, string> = {
  full: "w-full",
  large: "w-3/4",
  medium: "w-1/2",
  small: "w-1/4",
};

const alignmentClasses: Record<
  NonNullable<AssetImageElementProps["alignment"]>,
  string
> = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
};

export const AssetImageElement: UserComponent<AssetImageElementProps> = ({
  assetUuid,
  url,
  alt = "",
  width = "full",
  alignment = "center",
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

  const showPlaceholder = !url;
  const showIndicators = enabled && selected;

  return (
    <figure
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className={cn(
        "my-4",
        widthClasses[width],
        alignmentClasses[alignment],
        showIndicators && "ring-2 ring-accent ring-offset-2",
      )}
    >
      {showPlaceholder ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-2 py-12 rounded-lg border-2 border-dashed border-separator bg-surface/50 text-muted",
          )}
        >
          <MdImage className="text-4xl" />
          <span className="text-sm">
            {enabled ? "Select an image in settings" : "Image unavailable"}
          </span>
          {assetUuid && !url && (
            <span className="text-xs opacity-60">{assetUuid}</span>
          )}
        </div>
      ) : (
        <img
          src={url}
          alt={alt || "Blog image"}
          className="w-full h-auto rounded-lg"
          loading="lazy"
        />
      )}
      {alt && url && (
        <figcaption className="text-sm text-muted text-center mt-2">
          {alt}
        </figcaption>
      )}
    </figure>
  );
};

AssetImageElement.craft = {
  displayName: "Image",
  props: {
    assetUuid: undefined,
    url: undefined,
    alt: "",
    width: "full",
    alignment: "center",
  },
  related: {
    settings: AssetImageSettings,
  },
};
