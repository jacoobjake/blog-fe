"use client";

import { Button } from "@heroui/react";
import { FaChevronLeft, FaEye, FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";

type TopbarProps = {
  onPreview?: () => void;
  onFinish?: () => void;
  isSaving?: boolean;
};

export const Topbar = ({
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
          <FaChevronLeft />
          Back
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          aria-label="Toggle Preview"
          variant="outline"
          size="sm"
          onPress={onPreview}
        >
          <FaEye />
          Preview
        </Button>
        <Button
          aria-label="Finish Editing"
          variant="primary"
          size="sm"
          onPress={onFinish}
          isDisabled={isSaving}
        >
          <FaCheck />
          {isSaving ? "Saving..." : "Finish Editing"}
        </Button>
      </div>
    </div>
  );
};
