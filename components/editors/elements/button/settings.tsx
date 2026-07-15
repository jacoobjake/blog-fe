import ButtonSizeField from "@/components/forms/fields/button-size-field";
import ButtonVariantField from "@/components/forms/fields/button-variant-field";
import { useNode } from "@craftjs/core";
import { ButtonProps, Form, Input, Label, Select, ListBox, TextField } from "@heroui/react";
import type { ButtonElementProps } from "./types";

export const ButtonElementSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <Form className="space-y-4">
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
      <TextField type="url" name="href">
        <Label>Link URL</Label>
        <Input
          value={props.href ?? ""}
          placeholder="https://example.com or /blogs"
          onChange={(e) =>
            setProp(
              (props: ButtonElementProps) => (props.href = e.target.value),
            )
          }
        />
      </TextField>
      <div className="space-y-1">
        <Label>Open in</Label>
        <Select
          aria-label="Link target"
          value={props.target ?? "_self"}
          onChange={(value) =>
            setProp(
              (props: ButtonElementProps) =>
                (props.target = value as ButtonElementProps["target"]),
            )
          }
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="_self" textValue="Same tab">
                Same tab
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="_blank" textValue="New tab">
                New tab
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>
      </div>
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
