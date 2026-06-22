"use client";

import { Asset } from "@/lib/types";
import { Button, Spinner, Surface } from "@heroui/react";
import { useRef } from "react";
import { MdImage, MdUpload } from "react-icons/md";
import { useAssets, useUploadAsset } from "@/hooks/assets";
import { AssetType } from "@/lib/types";
import { UploadAssetSchema } from "@/lib/schemas";
import { useAssetPicker } from "./asset-picker";

type AssetManagerProps = {
  onInsert?: (asset: Asset) => void;
};

export function AssetManager({ onInsert }: AssetManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading } = useAssets({ first: 6, page: 1 });
  const uploadAsset = useUploadAsset();
  const { open, picker } = useAssetPicker({
    onSelect: (asset) => onInsert?.(asset),
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const parsed = UploadAssetSchema.safeParse({
      file,
      type: AssetType.Image,
    });
    if (!parsed.success) {
      alert(parsed.error.issues[0]?.message ?? "Invalid file");
      return;
    }

    try {
      const asset = await uploadAsset.mutateAsync(parsed.data);
      onInsert?.(asset);
    } catch {
      alert("Failed to upload asset. Please try again.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Surface className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">My Images</p>
        <Button
          variant="ghost"
          size="sm"
          onPress={() => fileInputRef.current?.click()}
          isDisabled={uploadAsset.isPending}
          isIconOnly
          aria-label="Upload image"
        >
          {uploadAsset.isPending ? <Spinner size="sm" /> : <MdUpload />}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Spinner size="sm" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {data?.data.map((asset) => {
            const thumbnailUrl =
              asset.media?.thumbnail_100 ?? asset.media?.url ?? undefined;
            return (
              <button
                key={asset.uuid}
                type="button"
                onClick={() => onInsert?.(asset)}
                className="aspect-square rounded-md overflow-hidden border border-separator hover:border-accent transition"
                title={asset.media?.file_name ?? "Image"}
              >
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={asset.media?.file_name ?? "Asset"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface">
                    <MdImage className="text-muted" />
                  </div>
                )}
              </button>
            );
          })}
          {data?.data.length === 0 && (
            <p className="col-span-3 text-xs text-muted text-center py-2">
              No images uploaded yet.
            </p>
          )}
        </div>
      )}

      <Button variant="outline" size="sm" className="w-full" onPress={open}>
        Browse all images
      </Button>

      {picker}
    </Surface>
  );
}
