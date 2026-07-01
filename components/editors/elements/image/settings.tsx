"use client";

import { useNode } from "@craftjs/core";
import { useEffect, useState } from "react";
import { Button, Input, Label, Slider, Surface, TextField } from "@heroui/react";
import {
  AssetManagerModal,
  useAssetManagerModal,
} from "@/components/editors/asset-manager";
import { ImagePositionPicker } from "@/components/editors/asset-manager/image-position-picker";
import { loadImageDimensions } from "@/lib/utils/image-frame";
import type { ImageElementProps } from "./types";

const MIN_HEIGHT = 80;
const MAX_HEIGHT = 1200;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

function clampHeight(value: number) {
  return Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, value));
}

export const ImageElementSettings = () => {
  const {
    assetUuid,
    src,
    alt,
    objectPosition,
    height,
    scale,
    intrinsicWidth,
    intrinsicHeight,
    actions: { setProp },
  } = useNode((node) => ({
    assetUuid: node.data.props.assetUuid as string | undefined,
    src: node.data.props.src as string | undefined,
    alt: node.data.props.alt as string | undefined,
    objectPosition: node.data.props.objectPosition as string | undefined,
    height: node.data.props.height as number | undefined,
    scale: node.data.props.scale as number | undefined,
    intrinsicWidth: node.data.props.intrinsicWidth as number | undefined,
    intrinsicHeight: node.data.props.intrinsicHeight as number | undefined,
  }));

  const modal = useAssetManagerModal();
  const currentHeight = height ?? 280;
  const currentScale = scale ?? 1;
  const [heightDraft, setHeightDraft] = useState(String(currentHeight));

  useEffect(() => {
    setHeightDraft(String(currentHeight));
  }, [currentHeight]);

  const commitHeight = () => {
    const parsed = Number(heightDraft);
    const nextHeight = Number.isFinite(parsed)
      ? clampHeight(parsed)
      : currentHeight;

    setProp((props: ImageElementProps) => {
      props.height = nextHeight;
    });
    setHeightDraft(String(nextHeight));
  };

  const applyAsset = async (asset: {
    uuid: string;
    media?: { url?: string; file_name?: string };
  }) => {
    const url = asset.media?.url;
    if (!url) return;

    let width = intrinsicWidth;
    let imageHeight = intrinsicHeight;

    try {
      const dimensions = await loadImageDimensions(url);
      width = dimensions.width;
      imageHeight = dimensions.height;
    } catch {
      width = undefined;
      imageHeight = undefined;
    }

    setProp((props: ImageElementProps) => {
      props.assetUuid = asset.uuid;
      props.src = url;
      props.intrinsicWidth = width;
      props.intrinsicHeight = imageHeight;
      if (!props.alt && asset.media?.file_name) {
        props.alt = asset.media.file_name.replace(/\.[^.]+$/, "");
      }
    });
  };

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
                props.intrinsicWidth = undefined;
                props.intrinsicHeight = undefined;
              })
            }
          >
            Remove image
          </Button>
        )}
      </div>

      <TextField>
        <Label>Container height (px)</Label>
        <Input
          type="number"
          inputMode="numeric"
          value={heightDraft}
          onChange={(e) => setHeightDraft(e.target.value)}
          onBlur={commitHeight}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commitHeight();
              e.currentTarget.blur();
            }
          }}
        />
      </TextField>

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

          <div className="space-y-2">
            <Label>Zoom ({Math.round(currentScale * 100)}%)</Label>
            <Slider
              minValue={MIN_SCALE}
              maxValue={MAX_SCALE}
              step={0.05}
              value={currentScale}
              onChange={(value) =>
                setProp((props: ImageElementProps) => {
                  props.scale = Array.isArray(value) ? value[0] : value;
                })
              }
            >
              <Slider.Output />
              <Slider.Track>
                <Slider.Fill />
                <Slider.Thumb />
              </Slider.Track>
            </Slider>
          </div>

          <ImagePositionPicker
            src={src}
            value={objectPosition ?? "50% 50%"}
            height={currentHeight}
            scale={currentScale}
            intrinsicWidth={intrinsicWidth}
            intrinsicHeight={intrinsicHeight}
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
        onSelect={(asset) => {
          void applyAsset(asset);
        }}
      />
    </Surface>
  );
};
