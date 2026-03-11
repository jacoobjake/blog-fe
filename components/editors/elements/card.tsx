import { ContainerElement } from "./container";
import { TextElement } from "./text";
import { ButtonElement } from "./button";
import { SurfaceProps } from "@heroui/react";
import { Node, useNode, UserComponent, Element } from "@craftjs/core";

export type CardElementProps = {
  variant?: SurfaceProps["variant"];
  padding?: number;
};

export type CardContentElementProps = {
  children?: React.ReactNode;
};

export type CardFooterElementProps = {
  children?: React.ReactNode;
};

export const CardContentElement: UserComponent<CardContentElementProps> = ({
  children,
}) => {
  const {
    connectors: { connect },
  } = useNode();
  return (
    <div
      ref={(ref) => {
        if (ref) connect(ref);
      }}
    >
      {children}
    </div>
  );
};

CardContentElement.craft = {
  props: {
    children: <TextElement text="Card Content" />,
  },
  rules: {
    canMoveIn: (incomingNodes: Node[]) =>
      incomingNodes.every(
        (incomingnode) => incomingnode.data.type === TextElement,
      ),
  },
};

export const CardFooterElement: UserComponent<CardFooterElementProps> = ({
  children,
}: CardFooterElementProps) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <div
      ref={(ref) => {
        if (ref) connect(ref);
      }}
    >
      {children}
    </div>
  );
};

CardFooterElement.craft = {
  props: {
    children: <ButtonElement size="sm" label="Learn more" variant="outline" />,
  },
  rules: {
    canMoveIn: (incomingNodes: Node[]) =>
      incomingNodes.every(
        (incomingnode) => incomingnode.data.type === ButtonElement,
      ),
  },
};

export const CardElement = ({ variant, padding = 20 }: CardElementProps) => {
  return (
    <ContainerElement variant={variant} padding={padding} className="space-y-4">
      <Element id="card_content" is={CardContentElement} canvas>
        <TextElement text="Title" fontSize={20} />
        <TextElement text="Subtitle" fontSize={15} />
      </Element>
      <Element id="card_footer" is={CardFooterElement} canvas>
        <ButtonElement size="sm" label="Learn more" variant="outline" />
        <ButtonElement size="sm" label="Another" variant="outline" />
      </Element>
    </ContainerElement>
  );
};
