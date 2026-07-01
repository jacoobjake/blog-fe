"use client";

import { Element, useEditor } from "@craftjs/core";
import { Button, Surface, Tooltip } from "@heroui/react";
import {
  ButtonElement,
  ContainerElement,
  TextElement,
  SpacerElement,
  ImageElement,
  TwoColumnElement,
} from "../elements";
import {
  MdOutlineRectangle,
  MdOutlineTouchApp,
  MdTextFields,
  MdOutlineImage,
  MdViewColumn,
} from "react-icons/md";
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
                <Element canvas is={ContainerElement} padding={20}>
                  <TextElement text="Container content" />
                </Element>,
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
        <Button
          ref={(ref) => {
            if (ref) {
              connectors.create(ref, <ImageElement />);
            }
          }}
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          Image
        </Button>
        <Button
          ref={(ref) => {
            if (ref) {
              connectors.create(ref, <TwoColumnElement />);
            }
          }}
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          Two Columns
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
        ariaLabel="Add text block"
        onCreate={(ref) => {
          if (ref) {
            connectors.create(ref, <TextElement text="New text block" />);
          }
        }}
        tooltip={<p>Text Block</p>}
      />
      <SlimToolboxButton
        icon={<MdOutlineRectangle />}
        ariaLabel="Add container"
        onCreate={(ref) => {
          if (ref) {
            connectors.create(
              ref,
              <Element canvas is={ContainerElement} padding={20}>
                <TextElement text="Container content" />
              </Element>,
            );
          }
        }}
        tooltip={<p>Container</p>}
      />
      <SlimToolboxButton
        icon={<MdOutlineTouchApp />}
        ariaLabel="Add button"
        onCreate={(ref) => {
          if (ref) {
            connectors.create(ref, <ButtonElement label="Click me" />);
          }
        }}
        tooltip={<p>Button</p>}
      />
      <SlimToolboxButton
        icon={<CgSpaceBetweenV />}
        ariaLabel="Add spacer"
        onCreate={(ref) => {
          if (ref) {
            connectors.create(ref, <SpacerElement height={40} />);
          }
        }}
        tooltip={<p>Spacer</p>}
      />
      <SlimToolboxButton
        icon={<MdOutlineImage />}
        ariaLabel="Add image"
        onCreate={(ref) => {
          if (ref) {
            connectors.create(ref, <ImageElement />);
          }
        }}
        tooltip={<p>Image</p>}
      />
      <SlimToolboxButton
        icon={<MdViewColumn />}
        ariaLabel="Add two columns"
        onCreate={(ref) => {
          if (ref) {
            connectors.create(ref, <TwoColumnElement />);
          }
        }}
        tooltip={<p>Two Columns</p>}
      />
    </Surface>
  );
};

const SlimToolboxButton = ({
  icon,
  ariaLabel,
  onCreate,
  tooltip,
}: {
  icon: React.ReactNode;
  ariaLabel: string;
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
        aria-label={ariaLabel}
      >
        {icon}
      </Button>
      <Tooltip.Content>{tooltip}</Tooltip.Content>
    </Tooltip>
  );
};
