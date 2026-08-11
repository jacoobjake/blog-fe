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

type EditAuthorPageContentProps = {
  author: AuthorProfile;
};

export default function EditAuthorPageContent({
  author,
}: EditAuthorPageContentProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (
    data: CreateAuthorProfileDto | UpdateAuthorProfileDto,
  ) => {
    const payload = { ...data };

    if (payload.user?.link === "none") {
      delete payload.user;
    }

    await updateAuthorAction(author.id, payload);
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
    <div className="space-y-6">
      <AuthorProfileForm
        author={author}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
      />
      <Button
        variant="outline"
        onPress={handleDelete}
        isPending={isDeleting}
        className="text-danger border-danger"
      >
        Delete author profile
      </Button>
    </div>
  );
}
