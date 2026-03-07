import { Separator, Surface, Tabs } from "@heroui/react";
import { Toolbox } from "./toolbox";
import { LayersPanel } from "./layers-panel";
import { SettingsPanel } from "./settings-panel";

export default function RightBar() {
  return (
    <Surface
      variant="default"
      className="w-80 border-l border-separator p-4 space-y-4 overflow-auto"
    >
      <Tabs className="max-h-64">
        <Tabs.ListContainer>
          <Tabs.List>
            <Tabs.Tab id="toolbox">Toolbox</Tabs.Tab>
            <Tabs.Tab id="layers">Layers</Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel id="toolbox" className="h-full overflow-auto">
          <Toolbox />
        </Tabs.Panel>
        <Tabs.Panel id="layers" className="h-full overflow-auto">
          <LayersPanel />
        </Tabs.Panel>
      </Tabs>
      <Separator orientation="horizontal" />
      <SettingsPanel />
    </Surface>
  );
}
