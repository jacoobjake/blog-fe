"use client";

import { Element, useEditor } from "@craftjs/core";
import { Button, Surface } from "@heroui/react";
import {
  ButtonElement,
  ContainerElement,
  TextElement,
  DroppableContainerElement,
  SpacerElement,
} from "../elements";

export const Toolbox = () => {
  const { connectors } = useEditor();

  return (
    <Surface>
      <p className="text-lg font-bold mb-3">Add Components</p>
      <div className="grid grid-cols-1 gap-2">
        <Button
          ref={(ref) => {
            if (ref) {
              connectors.create(ref, <TextElement text="New text block" />);
            }
          }}
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          Text Block
        </Button>
        <Button
          ref={(ref) => {
            if (ref) {
              connectors.create(
                ref,
                <ContainerElement padding={20}>
                  <TextElement text="Container content" />
                </ContainerElement>,
              );
            }
          }}
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          Container
        </Button>
        <Button
          ref={(ref) => {
            if (ref) {
              connectors.create(ref, <DroppableContainerElement />);
            }
          }}
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          Droppable Container
        </Button>
        <Button
          ref={(ref) => {
            if (ref) {
              connectors.create(ref, <ButtonElement label="Click me" />);
            }
          }}
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          Button
        </Button>
        <Button
          ref={(ref) => {
            if (ref) {
              connectors.create(ref, <SpacerElement height={40} />);
            }
          }}
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          Spacer
        </Button>
      </div>
    </Surface>
  );
};
