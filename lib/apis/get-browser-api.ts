import { createBrowserFetcher } from "./fetchers/browser";
import { createAuthApi } from "./modules/auth";
import { createBlogApi } from "./modules/blogs";
import { createGraphqlClient } from "./modules/graphql";

/**
 * Convenience helper for client components.
 *
 * Returns a set of pre-wired module instances using the browser fetch strategy.
 * Safe to import from client code.
 */
export function getBrowserApi(config?: { baseUrl?: string }) {
  const fetcher = createBrowserFetcher(config);

  return {
    fetcher,
    http: {
      request: fetcher,
    },
    graphql: createGraphqlClient(fetcher),
    auth: createAuthApi(fetcher),
    blogs: createBlogApi(fetcher),
  };
}
