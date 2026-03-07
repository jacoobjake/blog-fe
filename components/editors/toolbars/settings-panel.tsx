"use client";

import { useEditor } from "@craftjs/core";
import { Surface, Select, Button } from "@heroui/react";
import React from "react";

export const SettingsPanel = () => {
  const { selected, actions } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        isDeletable: query.node(currentNodeId).isDeletable(),
        settings:
          state.nodes[currentNodeId].related &&
          state.nodes[currentNodeId].related.settings,
      };
    }

    return {
      selected,
    };
  });
  return selected ? (
    <Surface>
      <p className="text-lg font-bold">Settings</p>
      <div className="grid grid-cols-1 gap-2">
        <div className="col-span-2 w-full flex justify-between items-center gap-1">
          <p>Selected</p>
          <Select>
            <Select.Trigger>{selected.name}</Select.Trigger>
          </Select>
        </div>
        {selected.settings && React.createElement(selected.settings)}
        {selected.isDeletable && (
          <div className="col-span-2">
            <Button
              variant="danger"
              fullWidth
              onPress={() => actions.delete(selected.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </Surface>
  ) : null;
};
