"use client";

import { Asset } from "@/lib/types";
import {
  Button,
  CloseButton,
  Modal,
  Spinner,
  Surface,
  cn,
  useOverlayState,
} from "@heroui/react";
import { useRef } from "react";
import { MdDelete, MdImage } from "react-icons/md";
import { useAssets, useDeleteAsset, useUploadAsset } from "@/hooks/assets";
import { AssetType } from "@/lib/types";
import { UploadAssetSchema } from "@/lib/schemas";

type AssetPickerProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: Asset) => void;
  selectedUuid?: string;
};

export function AssetPicker({
  isOpen,
  onOpenChange,
  onSelect,
  selectedUuid,
}: AssetPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading } = useAssets({ first: 24, page: 1 });
  const uploadAsset = useUploadAsset();
  const deleteAsset = useDeleteAsset();

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
      onSelect(asset);
      onOpenChange(false);
    } catch {
      alert("Failed to upload asset. Please try again.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (uuid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this asset? It may break images using it in blogs.")) {
      return;
    }

    try {
      await deleteAsset.mutateAsync(uuid);
    } catch {
      alert("Failed to delete asset. Please try again.");
    }
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container size="lg">
        <Modal.Dialog>
          <Modal.Header className="flex items-center justify-between">
            <Modal.Heading>Choose an image</Modal.Heading>
            <CloseButton onPress={() => onOpenChange(false)} />
          </Modal.Header>
          <Modal.Body>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted">
                Select an existing image or upload a new one.
              </p>
              <Button
                variant="outline"
                size="sm"
                onPress={() => fileInputRef.current?.click()}
                isDisabled={uploadAsset.isPending}
              >
                {uploadAsset.isPending ? <Spinner size="sm" /> : "Upload"}
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
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                {data?.data.map((asset) => (
                  <AssetThumbnail
                    key={asset.uuid}
                    asset={asset}
                    isSelected={asset.uuid === selectedUuid}
                    onSelect={() => {
                      onSelect(asset);
                      onOpenChange(false);
                    }}
                    onDelete={(e) => handleDelete(asset.uuid, e)}
                    isDeleting={
                      deleteAsset.isPending &&
                      deleteAsset.variables === asset.uuid
                    }
                  />
                ))}
                {data?.data.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted">
                    <MdImage className="mx-auto mb-2 text-3xl" />
                    <p>No images yet. Upload one to get started.</p>
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

type AssetThumbnailProps = {
  asset: Asset;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
  isDeleting: boolean;
};

function AssetThumbnail({
  asset,
  isSelected,
  onSelect,
  onDelete,
  isDeleting,
}: AssetThumbnailProps) {
  const thumbnailUrl =
    asset.media?.thumbnail_200 ?? asset.media?.url ?? undefined;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative aspect-square rounded-lg overflow-hidden border-2 transition",
        isSelected ? "border-accent" : "border-transparent hover:border-accent/50",
      )}
    >
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={asset.media?.file_name ?? "Asset"}
          className="w-full h-full object-cover"
        />
      ) : (
        <Surface className="w-full h-full flex items-center justify-center">
          <MdImage className="text-2xl text-muted" />
        </Surface>
      )}
      <button
        type="button"
        onClick={onDelete}
        disabled={isDeleting}
        className="absolute top-1 right-1 p-1 rounded bg-danger text-white opacity-0 group-hover:opacity-100 transition"
        aria-label="Delete asset"
      >
        {isDeleting ? <Spinner size="sm" /> : <MdDelete />}
      </button>
    </button>
  );
}

type UseAssetPickerOptions = {
  onSelect: (asset: Asset) => void;
  selectedUuid?: string;
};

export function useAssetPicker({ onSelect, selectedUuid }: UseAssetPickerOptions) {
  const { isOpen, open, close, setOpen } = useOverlayState();

  const picker = (
    <AssetPicker
      isOpen={isOpen}
      onOpenChange={setOpen}
      onSelect={onSelect}
      selectedUuid={selectedUuid}
    />
  );

  return { open, close, picker };
}
