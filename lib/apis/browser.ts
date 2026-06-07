import { createBrowserFetcher } from "./fetchers/browser";
import { createAuthApi } from "./modules/auth";
import { createBlogApi } from "./modules/blogs";

/**
 * Singleton browser fetcher — created once per page session.
 *
 * Safe to import from any client component. The fetcher handles Sanctum
 * CSRF prefetch lazily on the first non-GET request.
 */
const fetcher = createBrowserFetcher();

export const authApi = createAuthApi(fetcher);
export const blogApi = createBlogApi(fetcher);
