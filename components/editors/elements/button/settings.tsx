import ButtonSizeField from "@/components/forms/fields/button-size-field";
import ButtonVariantField from "@/components/forms/fields/button-variant-field";
import { useNode } from "@craftjs/core";
import { ButtonProps, Form, Input, Label, TextField } from "@heroui/react";
import type { ButtonElementProps } from "./types";

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
