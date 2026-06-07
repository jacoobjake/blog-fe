import type { ApiFetcher, ApiRequestOptions } from "../core/types";
import { handleResponse } from "../core/errors";
import { joinUrl } from "../core/url";

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  if (!match) return undefined;
  return match.slice(name.length + 1);
}

function buildClientHeaders(extra?: HeadersInit): Headers {
  const h = new Headers();
  h.set("Accept", "application/json");
  h.set("X-Requested-With", "XMLHttpRequest");

  if (extra) {
    const e = new Headers(extra);
    e.forEach((v, k) => h.set(k, v));
  }

  // Laravel Sanctum expects X-XSRF-TOKEN when XSRF-TOKEN cookie exists.
  // NOTE: header name must be `X-XSRF-TOKEN`.
  if (!h.has("x-xsrf-token") && typeof window !== "undefined") {
    const xsrf = readCookie("XSRF-TOKEN");
    if (xsrf) h.set("x-xsrf-token", decodeURIComponent(xsrf));
  }

  return h;
}

let sanctumCookiePrefetch: Promise<void> | null = null;

async function ensureSanctumCsrfCookie(baseUrl: string): Promise<void> {
  if (typeof window === "undefined") return;

  // If we already have the XSRF cookie, no need to prefetch.
  if (readCookie("XSRF-TOKEN")) return;

  // Only do this once per page session.
  if (!sanctumCookiePrefetch) {
    sanctumCookiePrefetch = fetch(joinUrl(baseUrl, "/sanctum/csrf-cookie"), {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then(() => undefined)
      .catch((err) => {
        sanctumCookiePrefetch = null; // reset so we can retry later
        throw err;
      });
  }

  await sanctumCookiePrefetch;
}

function toBodyAndHeaders(
  body: unknown,
  headers: Headers,
): BodyInit | undefined {
  if (body === undefined || body === null) return undefined;
  if (
    typeof body === "string" ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer
  ) {
    return body as BodyInit;
  }

  if (!headers.has("content-type"))
    headers.set("content-type", "application/json");
  return JSON.stringify(body);
}

export function createBrowserFetcher(config?: {
  baseUrl?: string;
}): ApiFetcher {
  const baseUrl = config?.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_API_BASE_URL. Set it in .env.local (e.g. http://localhost:8000).",
    );
  }

  return async function fetcher<TResponse = unknown, TBody = unknown>(
    options: ApiRequestOptions<TBody>,
  ) {
    // Sanctum SPA auth requires a preflight to set the XSRF-TOKEN cookie.
    // We do this lazily for non-GET requests (state-changing calls).
    const m = options.method ?? "GET";
    if (m !== "GET") {
      await ensureSanctumCsrfCookie(baseUrl);
    }

    const h = buildClientHeaders(options.headers);

    const res = await fetch(joinUrl(baseUrl, options.path), {
      method: m,
      headers: h,
      body: toBodyAndHeaders(options.body, h),
      credentials: "include",
      ...options.fetchInit,
    });

    return handleResponse<TResponse>(res);
  };
}
