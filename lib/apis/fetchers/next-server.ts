import type { ApiFetcher, ApiRequestOptions } from "../core/types";
import { handleResponse } from "../core/errors";
import { joinUrl } from "../core/url";

import { cookies, headers } from "next/headers";

/**
 * Next.js server fetcher that forwards the incoming request cookies.
 *
 * Safe to import ONLY from server code (RSC, server actions, route handlers).
 */
export async function createNextServerFetcher(config?: {
  baseUrl?: string;
  /**
   * If true (default), forward incoming request cookies/XSRF token.
   *
   * IMPORTANT: This makes the call dynamic in Next (uses `next/headers`).
   * Set to false to allow using this fetcher during static generation.
   */
  forwardCookies?: boolean;
  /** Optional explicit origin for Sanctum checks; falls back to derived origin */
  origin?: string;
}): Promise<ApiFetcher> {
  const baseUrl = config?.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_API_BASE_URL. Set it in .env.local (e.g. http://localhost:8000).",
    );
  }

  const forwardCookies = config?.forwardCookies ?? true;

  let cookieHeader: string | undefined;
  let xsrfToken: string | undefined;
  let derivedOrigin: string | undefined;

  if (forwardCookies) {
    const hdrs = await headers();
    const cookieStore = await cookies();
    cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
    xsrfToken = cookieStore.get("XSRF-TOKEN")?.value;

    // Derive an origin (Sanctum's stateful SPA middleware can rely on Origin/Referer).
    const proto =
      hdrs.get("x-forwarded-proto") ??
      hdrs.get("x-forwarded-protocol") ??
      "https";
    const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host");
    derivedOrigin = host ? `${proto}://${host}` : undefined;
  }

  const origin =
    config?.origin ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_FRONTEND_URL ??
    derivedOrigin;

  function buildHeaders(extra?: HeadersInit): Headers {
    const h = new Headers();
    h.set("Accept", "application/json");
    h.set("X-Requested-With", "XMLHttpRequest");

    if (origin) {
      if (!h.has("origin")) h.set("origin", origin);
      if (!h.has("referer")) h.set("referer", `${origin}/`);
    }

    if (extra) {
      const e = new Headers(extra);
      e.forEach((v, k) => h.set(k, v));
    }

    if (cookieHeader && !h.has("cookie")) h.set("cookie", cookieHeader);
    if (xsrfToken && !h.has("x-xsrf-token")) {
      h.set("x-xsrf-token", decodeURIComponent(xsrfToken));
    }

    return h;
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

  return async function fetcher<TResponse = unknown, TBody = unknown>(
    options: ApiRequestOptions<TBody>,
  ) {
    const m = options.method ?? "GET";
    const h = buildHeaders(options.headers);

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
