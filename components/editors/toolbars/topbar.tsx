"use client";

import { Button } from "@heroui/react";
import { FiCheck, FiChevronLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";

type TopbarProps = {
  isPreview?: boolean;
  onPreview?: () => void;
  onFinish?: () => void;
  isSaving?: boolean;
};

export const Topbar = ({
  isPreview = false,
  onPreview,
  onFinish,
  isSaving = false,
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
