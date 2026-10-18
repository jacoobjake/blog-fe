import type { Blog } from "@/lib/types";

export function getBlogAuthorName(blog: Pick<Blog, "author_profile">): string {
  return blog.author_profile?.name?.trim() ?? "";
}
