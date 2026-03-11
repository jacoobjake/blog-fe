"use client";

import { Layers } from "@craftjs/layers";
import { Surface } from "@heroui/react";

export const LayersPanel = () => {
  return (
    <Surface className="flex flex-col h-full">
      <p className="text-lg font-bold">Layers</p>
      <div className="grow overflow-auto">
        <Layers expandRootOnLoad />
      </div>
    </Surface>
  );
};
