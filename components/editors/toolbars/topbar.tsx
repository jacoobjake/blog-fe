"use client";

import { Button } from "@heroui/react";
import { FiCheck, FiChevronLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";

import type { AutoSaveStatus } from "@/hooks/editors";

type TopbarProps = {
  isPreview?: boolean;
  onPreview?: () => void;
  onFinish?: () => void;
  isSaving?: boolean;
  autoSaveStatus?: AutoSaveStatus;
  lastSavedAt?: Date | null;
  hasUnsavedChanges?: boolean;
};

function formatSavedAt(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getAutoSaveLabel(
  autoSaveStatus: AutoSaveStatus,
  lastSavedAt: Date | null | undefined,
  hasUnsavedChanges: boolean,
) {
  if (autoSaveStatus === "saving") return "Auto-saving...";
  if (autoSaveStatus === "pending" || hasUnsavedChanges) {
    return "Unsaved changes";
  }
  if (autoSaveStatus === "error") return "Auto-save failed";
  if (lastSavedAt) return `Saved at ${formatSavedAt(lastSavedAt)}`;
  return "All changes saved";
}

export const Topbar = ({
  isPreview = false,
  onPreview,
  onFinish,
  isSaving = false,
  autoSaveStatus = "idle",
  lastSavedAt = null,
  hasUnsavedChanges = false,
}: TopbarProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.push("/admin/blogs");
  };

  const autoSaveLabel = getAutoSaveLabel(
    autoSaveStatus,
    lastSavedAt,
    hasUnsavedChanges,
  );

  return (
    <div className="w-full h-14 bg-surface border-b border-separator flex justify-between items-center px-4">
      <div className="flex items-center gap-3">
        <Button
          aria-label="Go Back"
          variant="ghost"
          size="sm"
          onPress={handleBack}
        >
          <FiChevronLeft className="size-4 shrink-0" />
          Back
        </Button>
        {!isPreview && (
          <span
            className="text-xs text-muted"
            aria-live="polite"
            data-testid="auto-save-status"
          >
            {autoSaveLabel}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          aria-label={isPreview ? "Exit preview" : "Enter preview"}
          aria-pressed={isPreview}
          variant="outline"
          size="sm"
          onPress={onPreview}
        >
          {isPreview ? (
            <FiEyeOff className="size-4 shrink-0" />
          ) : (
            <FiEye className="size-4 shrink-0" />
          )}
          {isPreview ? "Exit Preview" : "Preview"}
        </Button>
        <Button
          aria-label="Finish Editing"
          variant="primary"
          size="sm"
          onPress={onFinish}
          isDisabled={isSaving}
        >
          <FiCheck className="size-4 shrink-0" />
          {isSaving ? "Saving..." : "Finish Editing"}
        </Button>
      </div>
    </div>
  );
};
