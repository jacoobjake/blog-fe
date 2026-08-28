"use client";

import AuthorProfileForm from "@/components/forms/authors/author-profile-form";
import { updateAuthorAction } from "@/lib/actions/authors";
import type {
  CreateAuthorProfileDto,
  UpdateAuthorProfileDto,
} from "@/lib/schemas/author-profile";
import type { AuthorProfile } from "@/lib/types";
import { toast } from "@heroui/react";
import { useRouter } from "next/navigation";

type EditAuthorPageContentProps = {
  author: AuthorProfile;
  formId: string;
};

export default function EditAuthorPageContent({
  author,
  formId,
}: EditAuthorPageContentProps) {
  const router = useRouter();

  const handleSubmit = async (
    data: CreateAuthorProfileDto | UpdateAuthorProfileDto,
  ) => {
    await updateAuthorAction(author.id, data);
    toast.success("Author profile updated successfully.");
    router.refresh();
  };

  return (
    <AuthorProfileForm
      author={author}
      formId={formId}
      onSubmit={handleSubmit}
    />
  );
}
