"use client";

import AuthorProfileForm from "@/components/forms/authors/author-profile-form";
import { createAuthorAction } from "@/lib/actions/authors";
import type {
  CreateAuthorProfileDto,
  UpdateAuthorProfileDto,
} from "@/lib/schemas/author-profile";
import { useRouter } from "next/navigation";

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

  return <AuthorProfileForm onSubmit={handleSubmit} submitLabel="Create author" />;
}
