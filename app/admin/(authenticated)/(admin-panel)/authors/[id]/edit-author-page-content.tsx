"use client";

import AuthorProfileForm from "@/components/forms/authors/author-profile-form";
import { updateAuthorAction } from "@/lib/actions/authors";
import type {
  CreateAuthorProfileDto,
  UpdateAuthorProfileDto,
} from "@/lib/schemas/author-profile";
import type { AuthorProfile } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type EditAuthorPageContentProps = {
  author: AuthorProfile;
  formId: string;
};

export default function EditAuthorPageContent({
  author,
  formId,
}: EditAuthorPageContentProps) {
  const router = useRouter();
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

  return (
    <div className="space-y-4">
      {successMessage && (
        <p className="text-sm text-success">{successMessage}</p>
      )}
      <AuthorProfileForm
        author={author}
        formId={formId}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
