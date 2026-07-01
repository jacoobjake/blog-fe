"use client";

import type { Asset } from "@/lib/types";
import {
  Button,
  CloseButton,
  Modal,
  useOverlayState,
} from "@heroui/react";
import { AssetGrid } from "./asset-grid";
import { UploadZone } from "./upload-zone";

type AssetManagerProps = {
  selectMode?: boolean;
  onSelect?: (asset: Asset) => void;
};

export function AssetManager({ selectMode = false, onSelect }: AssetManagerProps) {
  return (
    <div className="space-y-4">
      <UploadZone />
      <AssetGrid
        selectMode={selectMode}
        onSelect={onSelect}
      />
    </div>
  );
}

type AssetManagerModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: Asset) => void;
};

export function AssetManagerModal({
  isOpen,
  onOpenChange,
  onSelect,
}: AssetManagerModalProps) {
  const handleSelect = (asset: Asset) => {
    onSelect(asset);
    onOpenChange(false);
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
            <AssetManager selectMode onSelect={handleSelect} />
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

export function useAssetManagerModal() {
  return useOverlayState();
}
