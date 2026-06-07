"use client";

import { ButtonProps, Label, ListBox, Select } from "@heroui/react";

type ButtonVariantType = NonNullable<ButtonProps["variant"]>;

const BUTTON_VARIANT_OPTIONS: ButtonVariantType[] = [
  "primary",
  "secondary",
  "tertiary",
  "danger",
  "danger-soft",
  "ghost",
  "outline",
];

type ButtonVariantFieldProps = {
  value: ButtonVariantType;
  onChange: (value: ButtonVariantType) => void;
};

export default function ButtonVariantField({
  value,
  onChange,
}: ButtonVariantFieldProps) {
  return (
    <Select value={value} onChange={(v) => onChange(v as ButtonVariantType)}>
      <Label>Button Variant</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {BUTTON_VARIANT_OPTIONS.map((variant) => (
            <ListBox.Item key={variant} id={variant} textValue={variant}>
              {variant}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
