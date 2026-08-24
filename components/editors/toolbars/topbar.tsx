"use client";

import { Button, Tooltip } from "@heroui/react";
import {
  FiAlertCircle,
  FiCheck,
  FiCheckCircle,
  FiChevronLeft,
  FiCloud,
  FiEye,
  FiEyeOff,
  FiLoader,
} from "react-icons/fi";
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

function formatLastSavedAt(date: Date) {
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getAutoSaveTooltip(
  autoSaveStatus: AutoSaveStatus,
  lastSavedAt: Date | null | undefined,
  hasUnsavedChanges: boolean,
) {
  if (autoSaveStatus === "saving") return "Auto-saving...";
  if (autoSaveStatus === "error") return "Auto-save failed";
  if (autoSaveStatus === "pending" || hasUnsavedChanges) {
    return "Unsaved changes";
  }
  if (lastSavedAt) return `Last saved ${formatLastSavedAt(lastSavedAt)}`;
  return "All changes saved";
}

function AutoSaveStatusIcon({
  autoSaveStatus,
  lastSavedAt,
  hasUnsavedChanges,
}: {
  autoSaveStatus: AutoSaveStatus;
  lastSavedAt: Date | null | undefined;
  hasUnsavedChanges: boolean;
}) {
  const tooltip = getAutoSaveTooltip(
    autoSaveStatus,
    lastSavedAt,
    hasUnsavedChanges,
  );
  const isSaving = autoSaveStatus === "saving";
  const isError = autoSaveStatus === "error";
  const isPending = autoSaveStatus === "pending" || hasUnsavedChanges;

  const icon = isSaving ? (
    <FiLoader className="size-4 shrink-0 animate-spin text-muted" />
  ) : isError ? (
    <FiAlertCircle className="size-4 shrink-0 text-danger" />
  ) : isPending ? (
    <FiCloud className="size-4 shrink-0 text-muted" />
  ) : (
    <FiCheckCircle className="size-4 shrink-0 text-success" />
  );

  return (
    <Tooltip>
      <Button
        variant="ghost"
        size="sm"
        isIconOnly
        aria-label={tooltip}
        className="cursor-default"
        data-testid="auto-save-status"
      >
        {icon}
      </Button>
      <Tooltip.Content>{tooltip}</Tooltip.Content>
    </Tooltip>
  );
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

  return (
    <div className="w-full h-14 bg-surface border-b border-separator flex justify-between items-center px-4">
      <div>
        <Button
          aria-label="Go Back"
          variant="ghost"
          size="sm"
          onPress={handleBack}
        >
          <FiChevronLeft className="size-4 shrink-0" />
          Back
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {!isPreview && (
          <AutoSaveStatusIcon
            autoSaveStatus={autoSaveStatus}
            lastSavedAt={lastSavedAt}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        )}
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
