import { RouteConfig } from "@/constants/routes";

/**
 * Checks if the current pathname matches the route pattern
 * @param pathname - The current pathname from usePathname() or router
 * @param pattern - The pattern to match against. Can be:
 *   - A string for exact/prefix matching (e.g., "/admin/blogs")
 *   - A regex string for complex patterns (e.g., "^/admin/blogs(/.*)?$")
 * @returns boolean indicating if the pathname matches the pattern
 */
export function matchesRoutePattern(
  pathname: string,
  pattern: string | RegExp,
): boolean {
  // If pattern is already a RegExp, use it directly
  if (pattern instanceof RegExp) {
    return pattern.test(pathname);
  }

  // Check if the pattern string looks like a regex (starts with ^ or contains regex special chars)
  const isRegexPattern =
    pattern.startsWith("^") ||
    pattern.includes("(") ||
    pattern.includes("[") ||
    pattern.includes(".*");

  if (isRegexPattern) {
    try {
      const regex = new RegExp(pattern);
      return regex.test(pathname);
    } catch (e) {
      console.error(`Invalid regex pattern: ${pattern}`, e);
      return false;
    }
  }

  // String pattern matching
  // Exact match
  if (pathname === pattern) {
    return true;
  }

  // Check if pathname starts with pattern (for nested routes)
  // e.g., pattern "/admin/blogs" matches "/admin/blogs/123" or "/admin/blogs/edit/456"
  if (pathname.startsWith(pattern + "/")) {
    return true;
  }

  return false;
}

export function generateCrumbs(
  pathname: string,
  routes: RouteConfig[],
): { label: string; href: string }[] {
  const crumbs: { label: string; href: string }[] = [];
  const parts = pathname.split("/").filter(Boolean);

  for (let i = 0; i < parts.length; i++) {
    const href = "/" + parts.slice(0, i + 1).join("/");
    const matchedRoute = routes.find((route) =>
      matchesRoutePattern(href, route.pattern),
    );

    if (
      matchedRoute &&
      !crumbs.some((crumb) => crumb.href === matchedRoute.href)
    ) {
      crumbs.push({ label: matchedRoute.label, href });
    }
  }

  return crumbs;
}
