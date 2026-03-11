"use client";

import { Blog } from "@/lib/types";
import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import {
  TextElement,
  ContainerElement,
  ButtonElement,
  CardElement,
  BlogHeaderElement,
  RootCanvas,
  DroppableContainerElement,
  SpacerElement,
} from "./elements";
import { Topbar } from "./toolbars/topbar";
import { CardContentElement, CardFooterElement } from "./elements/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserApi } from "@/lib/apis";
import lz from "lz-string";
import RightBar from "./toolbars/right-bar";
import LeftBar from "./toolbars/left-bar";
import { RenderNode } from "./render-node";

type BlogEditorProps = {
  blog?: Blog;
};

export default function BlogEditor({ blog }: BlogEditorProps) {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handlePreview = () => {
    setIsPreview(!isPreview);
  };

  const handleFinish = async (
    query: ReturnType<typeof useEditor>["query"],
    actions: ReturnType<typeof useEditor>["actions"],
  ) => {
    setIsSaving(true);
    try {
      const api = getBrowserApi();

      // Get the serialized editor state
      const json = query.serialize();

      // Get blog header data
      const nodes = query.getNodes();
      const blogHeaderNode = Object.values(nodes).find(
        (node) => node.data.name === "BlogHeaderElement",
      );

      const title = blogHeaderNode?.data.props.title || "";
      const author = blogHeaderNode?.data.props.author || "";
      const tags = blogHeaderNode?.data.props.tags || [];
      const is_published = blogHeaderNode?.data.props.is_published || false;

      // Compress the JSON content
      const compressed = lz.compressToBase64(json);

      if (blog?.slug) {
        // Update existing blog
        await api.blogs.updateBlog(blog.slug, {
          title: title.trim(),
          author: author.trim(),
          json_content: {
            type: "compressed_base64",
            body: compressed,
          },
          is_published: is_published,
          tags: tags.filter((tag: string) => tag.trim() !== ""),
        });
      } else {
        // Create new blog
        const response = await api.blogs.createBlog({
          title: title.trim(),
          author: author.trim(),
          json_content: {
            type: "compressed_base64",
            body: compressed,
          },
          is_published: is_published,
          tags: tags.filter((tag: string) => tag.trim() !== ""),
        });

        // Redirect to the newly created blog editor
        router.push(`/admin/editor/blogs?slug=${response.slug}`);
        return;
      }

      // // Navigate back to blog list
      // router.push("/admin/blogs");
    } catch (error) {
      console.error("Failed to save blog:", error);
      alert("Failed to save blog. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-background overflow-hidden">
      <Editor
        resolver={{
          TextElement,
          ContainerElement,
          ButtonElement,
          CardElement,
          CardContentElement,
          CardFooterElement,
          BlogHeaderElement,
          RootCanvas,
          DroppableContainerElement,
          SpacerElement,
        }}
        enabled={!isPreview}
        onRender={RenderNode}
      >
        <EditorContent
          blog={blog}
          isPreview={isPreview}
          isSaving={isSaving}
          onPreview={handlePreview}
          onFinish={handleFinish}
        />
      </Editor>
    </div>
  );
}

function EditorContent({
  blog,
  isPreview,
  isSaving,
  onPreview,
  onFinish,
}: {
  blog?: Blog;
  isPreview: boolean;
  isSaving: boolean;
  onPreview: () => void;
  onFinish: (query: any, actions: any) => Promise<void>;
}) {
  const { query, actions } = useEditor();

  const handleFinishClick = () => {
    onFinish(query, actions);
  };

  // Load editor data based on content type
  const getEditorData = () => {
    if (!blog?.json_content) return undefined;

    const { type, body } = blog.json_content;

    switch (type) {
      case "compressed_base64":
        return lz.decompressFromBase64(body);
      case "json":
        // If it's already JSON string
        return typeof body === "string" ? body : JSON.stringify(body);
      default:
        // Try to use as-is
        return typeof body === "string" ? body : JSON.stringify(body);
    }
  };

  return (
    <>
      {/* Toolbar outside canvas */}
      <Topbar
        onPreview={onPreview}
        onFinish={handleFinishClick}
        isSaving={isSaving}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar with toolbox */}
        {!isPreview && <LeftBar />}
        {/* Main editor area */}
        <div className="flex-1 overflow-y-auto page-container max-w-4xl mx-auto">
          <Frame data={getEditorData()}>
            <RootCanvas>
              <Element is={ContainerElement} padding={20} canvas>
                <TextElement text="Start writing your blog content here..." />
              </Element>
            </RootCanvas>
          </Frame>
        </div>

        {/* Right sidebar with layer and settings */}
        {!isPreview && <RightBar />}
      </div>
    </>
  );
}
