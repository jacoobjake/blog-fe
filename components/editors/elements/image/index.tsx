"use client";

import { useEditor, useNode } from "@craftjs/core";
import { cn } from "@heroui/react";
import { ImageFrame } from "@/components/editors/shared/image-frame";
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
  intrinsicWidth,
  intrinsicHeight,
}: ImageElementProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const containerHeight = Math.max(80, height ?? DEFAULT_HEIGHT);

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className={cn("w-full my-4", alignmentClassNames[alignment])}
      data-asset-uuid={assetUuid}
    >
      {src ? (
        <ImageFrame
          src={src}
          alt={alt || "Blog image"}
          height={containerHeight}
          objectPosition={objectPosition}
          scale={scale ?? DEFAULT_SCALE}
          intrinsicWidth={intrinsicWidth}
          intrinsicHeight={intrinsicHeight}
          className="rounded-lg"
        />
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
  displayName: "Image",
  props: {
    assetUuid: undefined,
    src: undefined,
    alt: "",
    alignment: "center",
    objectPosition: "50% 50%",
    height: DEFAULT_HEIGHT,
    scale: DEFAULT_SCALE,
    intrinsicWidth: undefined,
    intrinsicHeight: undefined,
  },
  related: {
    settings: ImageElementSettings,
  },
};
