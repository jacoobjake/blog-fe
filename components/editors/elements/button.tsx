import ButtonSizeField from "@/components/forms/fields/button-size-field";
import ButtonVariantField from "@/components/forms/fields/button-variant-field";
import { useNode } from "@craftjs/core";
import {
  ButtonProps,
  buttonVariants,
  cn,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";

export type ButtonElementProps = {
  label: string;
  onClick?: () => void;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  color?: string;
  className?: string;
};

export const ButtonElement = ({
  label,
  onClick,
  size,
  variant,
  color,
  className,
}: ButtonElementProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <button
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      onClick={onClick}
      className={cn(
        buttonVariants({
          size,
          variant,
        }),
        className,
      )}
      style={{ color }}
    >
      {label}
    </button>
  );
};

export const ButtonElementSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <Form>
      <TextField type="text" name="label">
        <Label>Label</Label>
        <Input
          value={props.label}
          onChange={(e) =>
            setProp(
              (props: ButtonElementProps) => (props.label = e.target.value),
            )
          }
        />
      </TextField>
      <ButtonSizeField
        value={props.size}
        onChange={(value) =>
          setProp(
            (props: ButtonElementProps) =>
              (props.size = value as ButtonProps["size"]),
          )
        }
      />
      <ButtonVariantField
        value={props.variant}
        onChange={(value) =>
          setProp(
            (props: ButtonElementProps) =>
              (props.variant = value as ButtonProps["variant"]),
          )
        }
      />
    </Form>
  );
};

ButtonElement.craft = {
  displayName: "Button",
  props: {
    label: "Button",
    size: "md",
    variant: "primary",
  },
  related: {
    settings: ButtonElementSettings,
  },
};
