"use client";

import { Button, Spinner } from "@heroui/react";
import type { Asset } from "@/lib/types";
import { useDeleteAsset, useListAssets } from "@/hooks/assets";

type AssetGridProps = {
  onSelect?: (asset: Asset) => void;
  selectMode?: boolean;
};

export function AssetGrid({ onSelect, selectMode = false }: AssetGridProps) {
  const { data, isLoading, isError } = useListAssets({ first: 24, page: 1 });
  const deleteAsset = useDeleteAsset();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="sm" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-danger">Failed to load assets.</p>;
  }

  const assets = data?.data ?? [];

  if (assets.length === 0) {
    return (
      <p className="text-sm text-muted py-4 text-center">
        No images uploaded yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {assets.map((asset) => {
        const thumbnail = asset.media?.thumbnail_200 ?? asset.media?.url;

        return (
          <div
            key={asset.uuid}
            className="group relative aspect-square rounded-lg overflow-hidden border border-separator bg-accent/20"
          >
            {thumbnail ? (
              <button
                type="button"
                className="w-full h-full"
                onClick={() => onSelect?.(asset)}
                disabled={!selectMode}
              >
                <img
                  src={thumbnail}
                  alt={asset.media?.file_name ?? "Uploaded asset"}
                  className="w-full h-full object-cover"
                />
              </button>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted">
                No preview
              </div>
            )}

            {!selectMode && (
              <Button
                size="sm"
                variant="danger"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition"
                isDisabled={deleteAsset.isPending}
                onPress={() => deleteAsset.mutate(asset.uuid)}
              >
                Delete
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
