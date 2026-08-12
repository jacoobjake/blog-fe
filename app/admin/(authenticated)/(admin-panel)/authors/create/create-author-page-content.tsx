"use client";

import AuthorProfileForm from "@/components/forms/authors/author-profile-form";
import { createAuthorAction } from "@/lib/actions/authors";
import type {
  CreateAuthorProfileDto,
  UpdateAuthorProfileDto,
} from "@/lib/schemas/author-profile";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

const FORM_ID = "create-author-profile-form";

export default function CreateAuthorPageContent() {
  const router = useRouter();

  const handleSubmit = async (
    data: CreateAuthorProfileDto | UpdateAuthorProfileDto,
  ) => {
    const payload: CreateAuthorProfileDto = {
      name: data.name ?? "",
      bio: data.bio,
      user: data.user,
    };

    if (payload.user?.link === "none") {
      delete payload.user;
    }

    const author = await createAuthorAction(payload);
    router.push(`/admin/authors/${author.id}`);
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
          Create author
        </Button>
      </div>
      <AuthorProfileForm formId={FORM_ID} onSubmit={handleSubmit} />
    </>
  );
}
