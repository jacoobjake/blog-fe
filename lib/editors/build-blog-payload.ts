import type { useEditor } from "@craftjs/core";
import lz from "lz-string";

import type { CreateBlogDto } from "@/lib/schemas";
import { BlogContentType } from "@/lib/types";

type EditorQuery = ReturnType<typeof useEditor>["query"];

type BuildBlogPayloadOptions = {
  preservePublishState?: boolean;
  serverPublishState?: boolean;
};

export function getSerializedEditorState(query: EditorQuery): string {
  return query.serialize();
}

export function buildBlogPayload(
  query: EditorQuery,
  options?: BuildBlogPayloadOptions,
): CreateBlogDto | null {
  const json = query.serialize();
  const nodes = query.getNodes();
  const blogHeaderNode = Object.values(nodes).find(
    (node) => node.data.name === "BlogHeaderElement",
  );

  if (!blogHeaderNode) return null;

  const title = (blogHeaderNode.data.props.title as string) || "";
  const description = (blogHeaderNode.data.props.description as string) || "";
  const author = (blogHeaderNode.data.props.author as string) || "";
  const tags = (blogHeaderNode.data.props.tags as string[]) || [];
  const hero_asset_uuid =
    (blogHeaderNode.data.props.hero_asset_uuid as string | null) || null;

  let is_published = (blogHeaderNode.data.props.is_published as boolean) || false;
  if (options?.preservePublishState && options.serverPublishState !== undefined) {
    is_published = options.serverPublishState;
  }

  if (!title.trim() || !author.trim()) return null;

  const compressed = lz.compressToBase64(json);

  return {
    title: title.trim(),
    description: description.trim() || null,
    author: author.trim(),
    json_content: {
      type: BlogContentType.CompressedBase64,
      body: compressed,
    },
    hero_asset_uuid,
    is_published,
    tags: tags.filter((tag) => tag.trim() !== ""),
  };
}
