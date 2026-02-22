export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiFetchInit = Omit<RequestInit, "method" | "body" | "headers"> & {
  headers?: HeadersInit;
};

export type ApiRequestOptions<TBody = unknown> = {
  /** URL path relative to API base, e.g. "/graphql" or "api/admin/auth/session" */
  path: string;
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: TBody;
  /** Override fetch init options (credentials, cache, next, signal, etc.) */
  fetchInit?: ApiFetchInit;
};

export type ApiError = Error & {
  status?: number;
  data?: unknown;
};

/**
 * What modules depend on.
 *
 * Client code can use `createBrowserFetcher()`.
 * Server code (RSC/server actions/route handlers) can use `createNextServerFetcher()`.
 */
export type ApiFetcher = <TResponse = unknown, TBody = unknown>(
  options: ApiRequestOptions<TBody>,
) => Promise<TResponse>;
