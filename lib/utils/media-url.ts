/**
 * Normalize API-hosted media URLs for the frontend origin.
 *
 * Local API setups often serve APP_URL as http://localhost while the API
 * actually runs on http://localhost:8000, which breaks image requests.
 */
export function resolveMediaUrl(url: string | undefined | null): string | null {
  if (!url) return null;

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) return url;

  try {
    const resolved = new URL(url, apiBase);
    const api = new URL(apiBase);

    if (resolved.pathname.startsWith("/storage")) {
      resolved.protocol = api.protocol;
      resolved.hostname = api.hostname;
      resolved.port = api.port;
    }

    return resolved.toString();
  } catch {
    return url;
  }
}

export function getBlogHeroThumbnailCandidates(
  media?: {
    url?: string;
    thumbnail_200?: string;
    thumbnail_100?: string;
  } | null,
  fallback = "/images/jimmy_sticker.png",
): string[] {
  const candidates = [
    resolveMediaUrl(media?.url),
    resolveMediaUrl(media?.thumbnail_200),
    resolveMediaUrl(media?.thumbnail_100),
    fallback,
  ];

  return candidates.filter(
    (candidate, index, array): candidate is string =>
      Boolean(candidate) && array.indexOf(candidate) === index,
  );
}
