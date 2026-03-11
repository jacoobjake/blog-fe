"use client";

import { useEditor } from "@craftjs/core";
import { Button, Surface, Tooltip } from "@heroui/react";
import {
  ButtonElement,
  ContainerElement,
  TextElement,
  DroppableContainerElement,
  SpacerElement,
} from "../elements";
import {
  MdOutlineRectangle,
  MdOutlineTouchApp,
  MdTextFields,
} from "react-icons/md";
import { LuBlocks } from "react-icons/lu";
import { CgSpaceBetweenV } from "react-icons/cg";

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

export const SlimToolbox = () => {
  const { connectors } = useEditor();

  return (
    <Surface className="grid grid-cols-1 gap-2">
      <SlimToolboxButton
        icon={<MdTextFields />}
        onCreate={(ref) => {
          if (ref) {
            connectors.create(ref, <TextElement text="New text block" />);
          }
        }}
        tooltip={<p>Text Block</p>}
      />
      <SlimToolboxButton
        icon={<MdOutlineRectangle />}
        onCreate={(ref) => {
          if (ref) {
            connectors.create(
              ref,
              <ContainerElement padding={20}>
                <TextElement text="Container content" />
              </ContainerElement>,
            );
          }
        }}
        tooltip={<p>Container</p>}
      />
      <SlimToolboxButton
        icon={<LuBlocks />}
        onCreate={(ref) => {
          if (ref) {
            connectors.create(ref, <DroppableContainerElement />);
          }
        }}
        tooltip={<p>Droppable Container</p>}
      />
      <SlimToolboxButton
        icon={<MdOutlineTouchApp />}
        onCreate={(ref) => {
          if (ref) {
            connectors.create(ref, <ButtonElement label="Click me" />);
          }
        }}
        tooltip={<p>Button</p>}
      />
      <SlimToolboxButton
        icon={<CgSpaceBetweenV />}
        onCreate={(ref) => {
          if (ref) {
            connectors.create(ref, <SpacerElement height={40} />);
          }
        }}
        tooltip={<p>Spacer</p>}
      />
    </Surface>
  );
};

const SlimToolboxButton = ({
  icon,
  onCreate,
  tooltip,
}: {
  icon: React.ReactNode;
  onCreate: (ref: HTMLButtonElement | null) => void;
  tooltip: React.ReactNode;
}) => {
  return (
    <Tooltip>
      <Button
        ref={(ref) => {
          onCreate(ref);
        }}
        variant="outline"
        size="sm"
        className="cursor-move"
        isIconOnly
      >
        {icon}
      </Button>
      <Tooltip.Content>{tooltip}</Tooltip.Content>
    </Tooltip>
  );
};
