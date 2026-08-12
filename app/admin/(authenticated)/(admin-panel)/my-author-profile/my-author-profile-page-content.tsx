"use client";

import OwnAuthorProfileForm from "@/components/forms/authors/own-author-profile-form";
import { updateOwnAuthorProfileAction } from "@/lib/actions/authors";
import type { UpdateOwnAuthorProfileDto } from "@/lib/schemas/author-profile";
import type { AuthorProfile } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type MyAuthorProfilePageContentProps = {
  author: AuthorProfile;
  formId: string;
};

export default function MyAuthorProfilePageContent({
  author,
  formId,
}: MyAuthorProfilePageContentProps) {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (data: UpdateOwnAuthorProfileDto) => {
    await updateOwnAuthorProfileAction(data);
    setSuccessMessage("Author profile updated successfully.");
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {successMessage && (
        <p className="text-sm text-success">{successMessage}</p>
      )}
      <OwnAuthorProfileForm
        author={author}
        formId={formId}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
