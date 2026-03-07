"use client";

import { Button, ButtonProps } from "@heroui/react";
import { FiLayout } from "react-icons/fi";
import { useRouter } from "next/navigation";

type OpenEditorButtonProps = ButtonProps & {
  editorType?: "blog";
  slug?: string;
};

export default function OpenEditorButton({
  variant = "secondary",
  editorType = "blog",
  slug,
}: OpenEditorButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (editorType === "blog") {
      // Navigate to the blog editor in the current tab
      router.push(`/admin/editor/blogs?slug=${slug}`);
    }
  };

  return (
    <Button isIconOnly variant={variant} onClick={handleClick}>
      <FiLayout />
    </Button>
  );
}
