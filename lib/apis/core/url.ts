export function joinUrl(base: string, path: string) {
  if (!path) return base;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}
