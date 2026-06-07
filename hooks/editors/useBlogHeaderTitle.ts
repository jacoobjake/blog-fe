"use client";

import { useEditor } from "@craftjs/core";

export function useBlogHeaderTitle() {
  const { title } = useEditor((state) => {
    const blogHeaderNode = Object.values(state.nodes).find(
      (node) => node.data.name === "BlogHeaderElement",
    );

    return {
      title:
        (blogHeaderNode?.data.props.title as string) || "Untitled Blog Post",
    };
  });

  return title;
}
