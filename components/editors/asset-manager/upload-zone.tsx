"use client";

import { useRef, useState } from "react";
import { Button, Label, Surface } from "@heroui/react";
import { AssetType } from "@/lib/types";
import { useUploadAsset } from "@/hooks/assets";

type UploadZoneProps = {
  onUploaded?: () => void;
};

export function UploadZone({ onUploaded }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const uploadAsset = useUploadAsset();

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    setError(null);

    try {
      await uploadAsset.mutateAsync({
        file,
        type: AssetType.Image,
      });
      onUploaded?.();
    } catch {
      setError("Upload failed. Only JPEG and PNG images up to 10 MB are allowed.");
    }
  };

  return (
    <Surface className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <div
        className="border border-dashed border-separator rounded-lg p-6 text-center cursor-pointer hover:bg-accent/10 transition"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void handleFiles(e.dataTransfer.files);
        }}
      >
        <p className="text-sm text-muted">
          Drop an image here or click to upload
        </p>
        <p className="text-xs text-muted/70 mt-1">JPEG or PNG, max 10 MB</p>
      </div>
      {uploadAsset.isPending && (
        <p className="text-xs text-muted">Uploading...</p>
      )}
      {error && <p className="text-xs text-danger">{error}</p>}
    </Surface>
  );
}
