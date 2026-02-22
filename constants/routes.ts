export type RouteConfig = {
  href: string;
  label: string;
  icon: string;
  pattern: string; // Can be a simple string or regex pattern string
};

export const NAV_ROUTES: RouteConfig[] = [
  {
    href: "/",
    label: "Home",
    icon: "IoHome",
    pattern: "^/$", // Exact match for home page only
  },
  {
    href: "/blogs",
    label: "Blogs",
    icon: "LuBook",
    // Matches /blogs and /blogs/[slug]
    pattern: "^/blogs(/.*)?$",
  },
];

export const ADMIN_NAV_ROUTES: RouteConfig[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: "IoHome",
    pattern: "^/admin$", // Exact match only (won't match /admin/blogs)
  },
  {
    href: "/admin/blogs",
    label: "Blogs",
    icon: "LuBook",
    // Matches:
    // - /admin/blogs (exact)
    // - /admin/blogs/[slug] (view blog)
    // - /admin/blogs/edit/[slug] (edit blog)
    // - /admin/blogs/create (create blog)
    // Regex pattern: matches /admin/blogs and any sub-paths
    pattern: "^/admin/blogs(/.*)?$",
  },
];
