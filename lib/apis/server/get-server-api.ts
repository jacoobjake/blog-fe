import { createAuthApi } from "../modules/auth";
import { createGraphqlClient } from "../modules/graphql";
import { createNextServerFetcher } from "../fetchers/next-server";
import { createBlogApi } from "../modules/blogs";

/**
 * Convenience helper for server components / server actions.
 *
 * Returns a set of pre-wired module instances using the Next server fetch strategy.
 *
 * NOTE: If you need to run during static generation, pass `{ forwardCookies: false }`.
 */
export async function getServerApi(config?: {
  baseUrl?: string;
  forwardCookies?: boolean;
  origin?: string;
}) {
  const fetcher = await createNextServerFetcher(config);

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
