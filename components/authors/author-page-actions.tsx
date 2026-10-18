"use client";

import { deleteAuthorAction } from "@/lib/actions/authors";
import { formatError } from "@/lib/utils/api-error";
import { Button, toast, type ButtonProps } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SaveAuthorButtonProps = ButtonProps & {
  formId: string;
  label?: string;
};

export function SaveAuthorButton({
  formId,
  label = "Save changes",
  ...props
}: SaveAuthorButtonProps) {
  return (
    <Button type="submit" form={formId} {...props}>
      {label}
    </Button>
  );
}

type DeleteAuthorButtonProps = ButtonProps & {
  authorId: string;
  authorName: string;
};

export function DeleteAuthorButton({
  authorId,
  authorName,
  ...props
}: DeleteAuthorButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete author profile "${authorName}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAuthorAction(authorId);
      toast.success("Author profile deleted.");
      router.push("/admin/authors");
      router.refresh();
    } catch (error) {
      toast.danger(formatError(error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="danger"
      onPress={handleDelete}
      isPending={isDeleting}
      {...props}
    >
      Delete author profile
    </Button>
  );
}
