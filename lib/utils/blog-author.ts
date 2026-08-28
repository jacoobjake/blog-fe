import type { Blog } from "@/lib/types";

export const UNKNOWN_AUTHOR_NAME = "Unknown Author";

export function getBlogAuthorName(blog: Pick<Blog, "author_profile">): string {
  return blog.author_profile?.name?.trim() || UNKNOWN_AUTHOR_NAME;
}
