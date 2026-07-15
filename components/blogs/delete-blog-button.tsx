"use client";

import { useDeleteBlog } from "@/hooks/blogs";
import { formatError } from "@/lib/utils/api-error";
import { Button, Modal, useOverlayState } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

type DeleteBlogButtonProps = {
  slug: string;
  title: string;
  redirectTo?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export default function DeleteBlogButton({
  slug,
  title,
  redirectTo,
  variant = "danger",
  size = "sm",
}: DeleteBlogButtonProps) {
  const router = useRouter();
  const modal = useOverlayState();
  const deleteBlog = useDeleteBlog();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);

    try {
      await deleteBlog.mutateAsync(slug);
      modal.close();
      if (redirectTo) {
        router.push(redirectTo);
      }
    } catch (e) {
      setError(formatError(e).message);
    }
  };

  return (
    <>
      <Button
        size={size}
        variant={variant}
        isIconOnly
        aria-label={`Delete ${title}`}
        onPress={modal.open}
      >
        <FiTrash2 />
      </Button>

      <Modal.Backdrop isOpen={modal.isOpen} onOpenChange={modal.setOpen}>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Delete blog</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="space-y-3">
              <p>
                Are you sure you want to delete <strong>{title}</strong>? It
                will be removed from the site immediately.
              </p>
              {error && <p className="text-sm text-danger">{error}</p>}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onPress={modal.close}>
                Cancel
              </Button>
              <Button
                variant="danger"
                isPending={deleteBlog.isPending}
                onPress={handleDelete}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
