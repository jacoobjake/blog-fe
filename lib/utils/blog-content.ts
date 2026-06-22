import lz from "lz-string";
import { Blog, BlogContentType } from "@/lib/types";

type CraftNode = {
  type?: { resolvedName?: string };
  props?: Record<string, unknown>;
};

type CraftState = Record<string, CraftNode>;

function parseCraftState(blog: Blog): CraftState | null {
  if (!blog.json_content) return null;

  const { type, body } = blog.json_content;
  if (type !== BlogContentType.CompressedBase64) return null;

  const decompressed = lz.decompressFromBase64(body);
  if (!decompressed) return null;

  try {
    return JSON.parse(decompressed) as CraftState;
  } catch {
    return null;
  }
}

function findBlogHeaderNode(craftState: CraftState): CraftNode | null {
  return (
    Object.values(craftState).find(
      (node) => node?.type?.resolvedName === "BlogHeaderElement",
    ) ?? null
  );
}

export function extractBlogCoverImage(blog: Blog): string | null {
  const craftState = parseCraftState(blog);
  if (!craftState) return null;

  const header = findBlogHeaderNode(craftState);
  const coverUrl = header?.props?.coverImageUrl;
  return typeof coverUrl === "string" && coverUrl.length > 0 ? coverUrl : null;
}

export function extractBlogCoverAssetUuid(blog: Blog): string | null {
  const craftState = parseCraftState(blog);
  if (!craftState) return null;

  const header = findBlogHeaderNode(craftState);
  const coverUuid = header?.props?.coverAssetUuid;
  return typeof coverUuid === "string" && coverUuid.length > 0
    ? coverUuid
    : null;
}
