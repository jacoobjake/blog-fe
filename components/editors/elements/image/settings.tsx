"use client";

import { useNode } from "@craftjs/core";
import { Button, Input, Label, Surface, TextField } from "@heroui/react";
import {
  AssetManagerModal,
  useAssetManagerModal,
} from "@/components/editors/asset-manager";
import { ImagePositionPicker } from "@/components/editors/asset-manager/image-position-picker";
import type { ImageElementProps } from "./types";

export const ImageElementSettings = () => {
  const {
    assetUuid,
    src,
    alt,
    objectPosition,
    actions: { setProp },
  } = useNode((node) => ({
    assetUuid: node.data.props.assetUuid as string | undefined,
    src: node.data.props.src as string | undefined,
    alt: node.data.props.alt as string | undefined,
    objectPosition: node.data.props.objectPosition as string | undefined,
  }));

  const modal = useAssetManagerModal();

  return (
    <Surface className="space-y-4">
      <div className="space-y-2">
        <Button variant="outline" size="sm" onPress={modal.open}>
          {src ? "Change image" : "Choose image"}
        </Button>
        {src && (
          <Button
            variant="ghost"
            size="sm"
            onPress={() =>
              setProp((props: ImageElementProps) => {
                props.assetUuid = undefined;
                props.src = undefined;
              })
            }
          >
            Remove image
          </Button>
        )}
      </div>

      {src && (
        <>
          <TextField>
            <Label>Alt text</Label>
            <Input
              value={alt ?? ""}
              onChange={(e) =>
                setProp((props: ImageElementProps) => {
                  props.alt = e.target.value;
                })
              }
            />
          </TextField>

          <ImagePositionPicker
            src={src}
            value={objectPosition ?? "50% 50%"}
            onChange={(position) =>
              setProp((props: ImageElementProps) => {
                props.objectPosition = position;
              })
            }
          />
        </>
      )}

      <AssetManagerModal
        isOpen={modal.isOpen}
        onOpenChange={modal.setOpen}
        onSelect={(asset) =>
          setProp((props: ImageElementProps) => {
            props.assetUuid = asset.uuid;
            props.src = asset.media?.url;
          })
        }
      />
    </Surface>
  );
};
