"use client";

import { Separator, Surface } from "@heroui/react";
import { AssetManager } from "@/components/assets";
import { SlimToolbox, useInsertAssetImage } from "./toolbox";

export default function LeftBar() {
  const insertAssetImage = useInsertAssetImage();

  return (
    <Surface
      variant="default"
      className="left-bar border-r border-separator p-4 space-y-4 overflow-auto"
    >
      <SlimToolbox />
      <Separator />
      <AssetManager onInsert={insertAssetImage} />
    </Surface>
  );
}
