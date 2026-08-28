"use client";

import OwnAuthorProfileForm from "@/components/forms/authors/own-author-profile-form";
import { updateOwnAuthorProfileAction } from "@/lib/actions/authors";
import type { UpdateOwnAuthorProfileDto } from "@/lib/schemas/author-profile";
import type { AuthorProfile } from "@/lib/types";
import { toast } from "@heroui/react";
import { useRouter } from "next/navigation";

type MyAuthorProfilePageContentProps = {
  author: AuthorProfile;
  formId: string;
};

export default function MyAuthorProfilePageContent({
  author,
  formId,
}: MyAuthorProfilePageContentProps) {
  const router = useRouter();

  const handleSubmit = async (data: UpdateOwnAuthorProfileDto) => {
    await updateOwnAuthorProfileAction(data);
    toast.success("Author profile updated successfully.");
    router.refresh();
  };

  return (
    <OwnAuthorProfileForm
      author={author}
      formId={formId}
      onSubmit={handleSubmit}
    />
  );
}
