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

export const ImageElement = ({
  assetUuid,
  src,
  alt = "",
  alignment = "center",
  objectPosition = "50% 50%",
}: ImageElementProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className={cn("w-full my-4", alignmentClassNames[alignment])}
    >
      {src ? (
        <img
          src={src}
          alt={alt || "Blog image"}
          className="w-full max-w-full rounded-lg object-cover aspect-[16/9]"
          style={{ objectPosition }}
          data-asset-uuid={assetUuid}
        />
      ) : (
        <div
          className={cn(
            "w-full aspect-[16/9] rounded-lg border border-dashed border-separator",
            "flex items-center justify-center text-sm text-muted bg-accent/10",
          )}
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
  },
  related: {
    settings: ImageElementSettings,
  },
};
