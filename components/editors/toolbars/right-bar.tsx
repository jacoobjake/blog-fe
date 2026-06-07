import { Separator, Surface } from "@heroui/react";
import { LayersPanel } from "./layers-panel";
import { SettingsPanel } from "./settings-panel";

export default function RightBar() {
  return (
    <Surface
      variant="default"
      className="right-bar h-full w-80 border-l border-separator p-4 space-y-4 overflow-auto"
    >
      <div className="h-2/5">
        <LayersPanel />
      </div>
      <Separator orientation="horizontal" />
      <SettingsPanel />
    </Surface>
  );
}
