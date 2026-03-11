import { Surface } from "@heroui/react";
import { SlimToolbox } from "./toolbox";

export default function LeftBar() {
  return (
    <Surface
      variant="default"
      className="left-bar border-r border-separator p-4 space-y-4 overflow-auto"
    >
      <SlimToolbox />
    </Surface>
  );
}
