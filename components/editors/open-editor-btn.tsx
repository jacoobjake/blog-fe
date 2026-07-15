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
  ...props
}: OpenEditorButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (editorType === "blog") {
      router.push(
        slug ? `/admin/editor/blogs?slug=${slug}` : "/admin/editor/blogs",
      );
    }
  };

  return (
    <Button
      isIconOnly
      aria-label="Open editor"
      variant={variant}
      onClick={handleClick}
      {...props}
    >
      <FiLayout />
    </Button>
  );
}
