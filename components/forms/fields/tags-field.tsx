"use client";

import {
  Label,
  ListBox,
  ListBoxItem,
  Select,
  SelectProps,
} from "@heroui/react";

type TagsFieldProps = SelectProps<string[], "multiple">;

export default function TagsField(props: TagsFieldProps) {
  return (
    <div>
      <Select {...props} selectionMode="multiple">
        <Label>Tags</Label>
        <Select.Trigger>
          Select Tags
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox selectionMode="multiple">
            <ListBox.Item id="tag1" textValue="tag1">
              Tag 1
              <ListBoxItem.Indicator />
            </ListBox.Item>
            <ListBox.Item id="tag2" textValue="tag2">
              Tag 2
              <ListBoxItem.Indicator />
            </ListBox.Item>
            <ListBox.Item id="tag3" textValue="tag3">
              Tag 3
              <ListBoxItem.Indicator />
            </ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
      <div className="mt-2">
        {props.value?.map((tag) => (
          <span
            key={tag}
            className="inline-block bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold text-gray-700 mr-2"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
