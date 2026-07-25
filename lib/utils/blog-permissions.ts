import type { Blog } from "@/lib/types/blog";
import type { User } from "@/lib/types/user";

const ELEVATED_ROLES = new Set(["admin", "editor"]);

export function canManageBlog(user: User | null | undefined, blog: Blog): boolean {
  if (!user) {
    return false;
  }

  if (user.roles.some((role) => ELEVATED_ROLES.has(role))) {
    return true;
  }

  return user.roles.includes("author") && blog.created_by?.id === user.id;
}
