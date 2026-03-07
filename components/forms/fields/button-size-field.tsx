"use client";

import { ButtonProps, Label, ListBox, Select } from "@heroui/react";

type ButtonSizeType = NonNullable<ButtonProps["size"]>;

const BUTTON_SIZE_OPTIONS: ButtonSizeType[] = ["sm", "md", "lg"];

type ButtonSizeFieldProps = {
  value: ButtonSizeType;
  onChange: (value: ButtonSizeType) => void;
};

export default function ButtonSizeField({
  value,
  onChange,
}: ButtonSizeFieldProps) {
  return (
    <Select value={value} onChange={(v) => onChange(v as ButtonSizeType)}>
      <Label>Button Size</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {BUTTON_SIZE_OPTIONS.map((size) => (
            <ListBox.Item key={size} id={size} textValue={size}>
              {size}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
