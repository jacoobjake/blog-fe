"use server";

import { revalidatePath } from "next/cache";

type RevalidatePublicBlogsOptions = {
  slug: string;
  previousSlug?: string;
};

export async function revalidatePublicBlogs({
  slug,
  previousSlug,
}: RevalidatePublicBlogsOptions) {
  revalidatePath("/blogs");

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/blogs/${previousSlug}`);
  }

  revalidatePath(`/blogs/${slug}`);
}
