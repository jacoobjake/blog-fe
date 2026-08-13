import type { RouteConfig } from "@/constants/routes";
import type { User } from "@/lib/types/user";
import {
  canManageAuthors,
  canManageOwnAuthorProfile,
} from "@/lib/utils/author-permissions";

export function getAdminNavRoutes(user: User | null | undefined): RouteConfig[] {
  const routes: RouteConfig[] = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: "IoHome",
      pattern: "^/admin$",
    },
    {
      href: "/admin/blogs",
      label: "Blogs",
      icon: "LuBook",
      pattern: "^/admin/blogs(/.*)?$",
    },
  ];

  if (canManageAuthors(user)) {
    routes.push({
      href: "/admin/authors",
      label: "Authors",
      icon: "LuUsers",
      pattern: "^/admin/authors(/.*)?$",
    });
  }

  if (canManageOwnAuthorProfile(user)) {
    routes.push({
      href: "/admin/my-author-profile",
      label: "My Author Profile",
      icon: "LuUserPen",
      pattern: "^/admin/my-author-profile$",
    });
  }

  return routes;
}
