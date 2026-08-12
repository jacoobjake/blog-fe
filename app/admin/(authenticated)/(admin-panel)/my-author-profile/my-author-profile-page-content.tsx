"use client";

import OwnAuthorProfileForm from "@/components/forms/authors/own-author-profile-form";
import { updateOwnAuthorProfileAction } from "@/lib/actions/authors";
import type { UpdateOwnAuthorProfileDto } from "@/lib/schemas/author-profile";
import type { AuthorProfile } from "@/lib/types";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FORM_ID = "own-author-profile-form";

type MyAuthorProfilePageContentProps = {
  author: AuthorProfile;
};

export default function MyAuthorProfilePageContent({
  author,
}: MyAuthorProfilePageContentProps) {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (data: UpdateOwnAuthorProfileDto) => {
    await updateOwnAuthorProfileAction(data);
    setSuccessMessage("Author profile updated successfully.");
    router.refresh();
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
          Save profile
        </Button>
      </div>
      <div className="space-y-4">
        {successMessage && (
          <p className="text-sm text-success">{successMessage}</p>
        )}
        <OwnAuthorProfileForm
          author={author}
          formId={FORM_ID}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
