"use client";

import { useNode } from "@craftjs/core";
import { Button, Input, Label, ListBox, Select, Surface, TextField } from "@heroui/react";
import type { Asset } from "@/lib/types";
import { useAssetPicker } from "@/components/assets";
import type {
  AssetImageAlignment,
  AssetImageElementProps,
  AssetImageWidth,
} from "./types";

const widthOptions: { id: AssetImageWidth; label: string }[] = [
  { id: "full", label: "Full width" },
  { id: "large", label: "Large (75%)" },
  { id: "medium", label: "Medium (50%)" },
  { id: "small", label: "Small (25%)" },
];

const alignmentOptions: { id: AssetImageAlignment; label: string }[] = [
  { id: "left", label: "Left" },
  { id: "center", label: "Center" },
  { id: "right", label: "Right" },
];

export const AssetImageSettings = () => {
  const {
    assetUuid,
    url,
    alt,
    width,
    alignment,
    actions: { setProp },
  } = useNode((node) => ({
    assetUuid: node.data.props.assetUuid as string | undefined,
    url: node.data.props.url as string | undefined,
    alt: node.data.props.alt as string,
    width: node.data.props.width as AssetImageWidth,
    alignment: node.data.props.alignment as AssetImageAlignment,
  }));

  const handleSelectAsset = (asset: Asset) => {
    setProp((props: AssetImageElementProps) => {
      props.assetUuid = asset.uuid;
      props.url = asset.media?.url;
      if (!props.alt && asset.media?.file_name) {
        props.alt = asset.media.file_name.replace(/\.[^.]+$/, "");
      }
    });
  };

  const { open, picker } = useAssetPicker({
    onSelect: handleSelectAsset,
    selectedUuid: assetUuid,
  });

  const handleClear = () => {
    setProp((props: AssetImageElementProps) => {
      props.assetUuid = undefined;
      props.url = undefined;
    });
  };

  return (
    <Surface className="space-y-4">
      {url && (
        <img
          src={url}
          alt={alt || "Selected image"}
          className="w-full h-32 object-cover rounded-md"
        />
      )}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onPress={open}>
          {url ? "Change image" : "Choose image"}
        </Button>
        {url && (
          <Button variant="ghost" size="sm" onPress={handleClear}>
            Remove
          </Button>
        )}
      </div>

      <TextField>
        <Label>Alt text</Label>
        <Input
          value={alt ?? ""}
          onChange={(e) =>
            setProp((props: AssetImageElementProps) => {
              props.alt = e.target.value;
            })
          }
          placeholder="Describe the image"
        />
      </TextField>

      <Select
        value={width}
        onChange={(key) =>
          setProp((props: AssetImageElementProps) => {
            props.width = key as AssetImageWidth;
          })
        }
      >
        <Label>Width</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {widthOptions.map((option) => (
              <ListBox.Item key={option.id} id={option.id} textValue={option.label}>
                {option.label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <Select
        value={alignment}
        onChange={(key) =>
          setProp((props: AssetImageElementProps) => {
            props.alignment = key as AssetImageAlignment;
          })
        }
      >
        <Label>Alignment</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {alignmentOptions.map((option) => (
              <ListBox.Item key={option.id} id={option.id} textValue={option.label}>
                {option.label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      {picker}
    </Surface>
  );
};
