import type { ApiFetcher, ApiRequestOptions } from "./types";

/**
 * Small helper to do REST-ish requests without repeating `path/method/body` plumbing.
 *
 * This is intentionally thin: auth/csrf/etc. should live in your API (Laravel) and
 * cookie forwarding is handled by the fetcher.
 */
export function createApiClient(fetcher: ApiFetcher) {
  return {
    request: <TResponse = unknown, TBody = unknown>(
      options: ApiRequestOptions<TBody>,
    ) => fetcher<TResponse, TBody>(options),

    get: <TResponse = unknown>(
      path: string,
      options?: Omit<ApiRequestOptions, "path" | "method" | "body">,
    ) => fetcher<TResponse>({ path, method: "GET", ...options }),

    post: <TResponse = unknown, TBody = unknown>(
      path: string,
      body?: TBody,
      options?: Omit<ApiRequestOptions<TBody>, "path" | "method" | "body">,
    ) => fetcher<TResponse, TBody>({ path, method: "POST", body, ...options }),

    put: <TResponse = unknown, TBody = unknown>(
      path: string,
      body?: TBody,
      options?: Omit<ApiRequestOptions<TBody>, "path" | "method" | "body">,
    ) => fetcher<TResponse, TBody>({ path, method: "PUT", body, ...options }),

    patch: <TResponse = unknown, TBody = unknown>(
      path: string,
      body?: TBody,
      options?: Omit<ApiRequestOptions<TBody>, "path" | "method" | "body">,
    ) => fetcher<TResponse, TBody>({ path, method: "PATCH", body, ...options }),

    delete: <TResponse = unknown>(
      path: string,
      options?: Omit<ApiRequestOptions, "path" | "method" | "body">,
    ) => fetcher<TResponse>({ path, method: "DELETE", ...options }),
  };
}
