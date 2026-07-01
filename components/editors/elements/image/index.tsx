"use client";

import { useEditor, useNode } from "@craftjs/core";
import { cn } from "@heroui/react";
import { ImageElementSettings } from "./settings";
import type { ImageElementProps } from "./types";

export type { ImageElementProps } from "./types";

const alignmentClassNames = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
};

const DEFAULT_HEIGHT = 280;
const DEFAULT_SCALE = 1;

export const ImageElement = ({
  assetUuid,
  src,
  alt = "",
  alignment = "center",
  objectPosition = "50% 50%",
  height = DEFAULT_HEIGHT,
  scale = DEFAULT_SCALE,
}: ImageElementProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const containerHeight = Math.max(80, height ?? DEFAULT_HEIGHT);
  const imageScale = Math.min(3, Math.max(0.5, scale ?? DEFAULT_SCALE));

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className={cn("w-full my-4", alignmentClassNames[alignment])}
    >
      {src ? (
        <div
          className="w-full rounded-lg overflow-hidden"
          style={{ height: containerHeight }}
        >
          <img
            src={src}
            alt={alt || "Blog image"}
            className="w-full h-full object-cover"
            style={{
              objectPosition,
              transform: `scale(${imageScale})`,
              transformOrigin: objectPosition,
            }}
            data-asset-uuid={assetUuid}
          />
        </div>
      ) : (
        <div
          className={cn(
            "w-full rounded-lg border border-dashed border-separator",
            "flex items-center justify-center text-sm text-muted bg-accent/10",
          )}
          style={{ height: containerHeight }}
        >
          {enabled ? "Select an image in the settings panel" : "Image unavailable"}
        </div>
      )}
    </div>
  );
};

ImageElement.craft = {
  displayName: "ImageElement",
  props: {
    assetUuid: undefined,
    src: undefined,
    alt: "",
    alignment: "center",
    objectPosition: "50% 50%",
    height: DEFAULT_HEIGHT,
    scale: DEFAULT_SCALE,
  },
  related: {
    settings: ImageElementSettings,
  },
};
