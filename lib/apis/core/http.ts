import type { ApiFetcher } from "./types";

/**
 * Creates typed shorthand HTTP method helpers bound to the given fetcher.
 * Avoids copy-pasting `post`, `put`, `del` in every module factory.
 */
export function createHttpMethods(fetcher: ApiFetcher) {
  return {
    get: <T>(path: string) => fetcher<T>({ path, method: "GET" }),
    post: <T>(path: string, body?: unknown) =>
      fetcher<T>({ path, method: "POST", body }),
    put: <T>(path: string, body?: unknown) =>
      fetcher<T>({ path, method: "PUT", body }),
    patch: <T>(path: string, body?: unknown) =>
      fetcher<T>({ path, method: "PATCH", body }),
    del: (path: string) => fetcher({ path, method: "DELETE" }),
  };
}
