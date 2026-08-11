import type { User } from "@/lib/types/user";

const MANAGE_AUTHORS_ROLES = new Set(["superadmin", "admin"]);
const OWN_AUTHOR_PROFILE_ROLES = new Set(["author"]);

export function canManageAuthors(user: User | null | undefined): boolean {
  if (!user) {
    return false;
  }

  return user.roles.some((role) => MANAGE_AUTHORS_ROLES.has(role));
}

export function canManageOwnAuthorProfile(
  user: User | null | undefined,
): boolean {
  if (!user) {
    return false;
  }

  return user.roles.some((role) => OWN_AUTHOR_PROFILE_ROLES.has(role));
}

export function canSelectAuthorProfiles(user: User | null | undefined): boolean {
  if (!user) {
    return false;
  }

  return (
    canManageAuthors(user) ||
    user.roles.includes("editor") ||
    canManageOwnAuthorProfile(user)
  );
}
