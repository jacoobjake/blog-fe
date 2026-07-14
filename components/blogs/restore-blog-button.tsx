"use client";

import { useRestoreBlog } from "@/hooks/blogs";
import { formatError } from "@/lib/utils/api-error";
import { Button } from "@heroui/react";
import { FiRotateCcw } from "react-icons/fi";
import { useState } from "react";

type RestoreBlogButtonProps = {
  slug: string;
  title: string;
  size?: "sm" | "md" | "lg";
};

export default function RestoreBlogButton({
  slug,
  title,
  size = "sm",
}: RestoreBlogButtonProps) {
  const restoreBlog = useRestoreBlog();
  const [error, setError] = useState<string | null>(null);

  const handleRestore = async () => {
    setError(null);

    try {
      await restoreBlog.mutateAsync(slug);
    } catch (e) {
      setError(formatError(e).message);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        size={size}
        variant="secondary"
        aria-label={`Restore ${title}`}
        isPending={restoreBlog.isPending}
        onPress={handleRestore}
      >
        <FiRotateCcw />
        Restore
      </Button>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
