"use client";

import AuthorProfileForm from "@/components/forms/authors/author-profile-form";
import { deleteAuthorAction, updateAuthorAction } from "@/lib/actions/authors";
import type {
  CreateAuthorProfileDto,
  UpdateAuthorProfileDto,
} from "@/lib/schemas/author-profile";
import type { AuthorProfile } from "@/lib/types";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FORM_ID = "author-profile-form";

type EditAuthorPageContentProps = {
  author: AuthorProfile;
};

export default function EditAuthorPageContent({
  author,
}: EditAuthorPageContentProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (
    data: CreateAuthorProfileDto | UpdateAuthorProfileDto,
  ) => {
    const payload = { ...data };

    if (payload.user?.link === "none") {
      delete payload.user;
    }

    await updateAuthorAction(author.id, payload);
    setSuccessMessage("Author profile updated successfully.");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm(`Delete author profile "${author.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAuthorAction(author.id);
      router.push("/admin/authors");
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div data-slot-container>
        <Button
          type="submit"
          form={FORM_ID}
          data-slot="extra-actions"
          data-slot-priority={10}
        >
          Save changes
        </Button>
        <Button
          variant="outline"
          onPress={handleDelete}
          isPending={isDeleting}
          data-slot="extra-actions"
          data-slot-priority={20}
          className="text-danger border-danger"
        >
          Delete author profile
        </Button>
      </div>
      <div className="space-y-4">
        {successMessage && (
          <p className="text-sm text-success">{successMessage}</p>
        )}
        <AuthorProfileForm
          author={author}
          formId={FORM_ID}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
