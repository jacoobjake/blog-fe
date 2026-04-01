import { createAuthApi } from "../modules/auth";
import { createGraphqlClient } from "../modules/graphql";
import { createNextServerFetcher } from "../fetchers/next-server";
import { createBlogApi } from "../modules/blogs";

type ServerApiConfig = {
  baseUrl?: string;
  forwardCookies?: boolean;
  origin?: string;
};

/**
 * Returns all API modules wired to the Next.js server fetcher.
 *
 * Use this when a single RSC/action needs multiple modules.
 * NOTE: If you need to run during static generation, pass `{ forwardCookies: false }`.
 */
export async function getServerApi(config?: ServerApiConfig) {
  const fetcher = await createNextServerFetcher(config);

  return {
    fetcher,
    graphql: createGraphqlClient(fetcher),
    auth: createAuthApi(fetcher),
    blogs: createBlogApi(fetcher),
  };
}

/**
 * Per-module helpers — use these when an RSC only needs one module,
 * to avoid constructing everything unnecessarily.
 */
export async function getServerAuthApi(config?: ServerApiConfig) {
  return createAuthApi(await createNextServerFetcher(config));
}

export async function getServerBlogApi(config?: ServerApiConfig) {
  return createBlogApi(await createNextServerFetcher(config));
}
