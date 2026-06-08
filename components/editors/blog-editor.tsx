"use client";

import { Blog, BlogContentType } from "@/lib/types";
import { Editor, Frame, useEditor } from "@craftjs/core";
import {
  TextElement,
  ContainerElement,
  ButtonElement,
  BlogHeaderElement,
  RootCanvas,
  SpacerElement,
} from "./elements";
import { Topbar } from "./toolbars/topbar";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { createBlogAction, updateBlogAction } from "@/lib/actions";
import lz from "lz-string";
import RightBar from "./toolbars/right-bar";
import LeftBar from "./toolbars/left-bar";
import { RenderNode } from "./render-node";
import { useAuthStore } from "@/hooks/auth";
import { useBlogEditorCrumbs, useBlogHeaderTitle } from "@/hooks/editors";
import { PublicBreadcrumbsList } from "@/components/nav/public/breadcrumbs";

type BlogEditorProps = {
  blog?: Blog;
};

function deserializeBlogContent(blog: Blog) {
  if (!blog.json_content) return undefined;

  const { type, body } = blog.json_content;

  switch (type) {
    case BlogContentType.CompressedBase64:
      return lz.decompressFromBase64(body);
    default:
      // Fallback: use as-is
      return typeof body === "string" ? body : JSON.stringify(body);
  }
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
        await updateBlogAction(blog.slug, {
          title: title.trim(),
          author: author.trim(),
          json_content: {
            type: BlogContentType.CompressedBase64,
            body: compressed,
          },
          is_published: is_published,
          tags: tags.filter((tag: string) => tag.trim() !== ""),
        });
      } else {
        // Create new blog
        const response = await createBlogAction({
          title: title.trim(),
          author: author.trim(),
          json_content: {
            type: BlogContentType.CompressedBase64,
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

  return <div className="w-full h-screen flex flex-col bg-background overflow-hidden">
    <EditorContainer enabled={!isPreview} >
      <EditorContent
        blog={blog}
        isPreview={isPreview}
        isSaving={isSaving}
        onPreview={handlePreview}
        onFinish={handleFinish} />
    </EditorContainer>
  </div>;
}

export function BlogContentViewer({ blog }: { blog: Blog }) {
  return (
    <EditorContainer enabled={false}>
      <Frame data={deserializeBlogContent(blog)} />
    </EditorContainer>
  );
}

function EditorContainer({ enabled, children }: { enabled: boolean, children: ReactNode }) {
  return <Editor
    resolver={{
      TextElement,
      ContainerElement,
      ButtonElement,
      BlogHeaderElement,
      RootCanvas,
      SpacerElement,
    }}
    enabled={enabled}
    onRender={RenderNode}
  >
    {children}
  </Editor>
}

function BlogEditorBreadcrumbs({
  slug,
  title,
}: {
  slug?: string;
  title: string;
}) {
  const crumbs = useBlogEditorCrumbs(slug, title);

  return <PublicBreadcrumbsList crumbs={crumbs} linkable={false} />;
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
  const user = useAuthStore((s) => s.user ?? undefined);
  const title = useBlogHeaderTitle();

  const handleFinishClick = () => {
    onFinish(query, actions);
  };

  return (
    <>
      {/* Toolbar outside canvas */}
      <Topbar
        isPreview={isPreview}
        onPreview={onPreview}
        onFinish={handleFinishClick}
        isSaving={isSaving}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar with toolbox */}
        {!isPreview && <LeftBar />}
        {/* Main editor area */}
        <div className="flex-1 overflow-y-auto page-container w-full max-w-5xl mx-auto p-6">
          <BlogEditorBreadcrumbs slug={blog?.slug} title={title} />
          <Frame data={blog ? deserializeBlogContent(blog) : undefined}>
            <RootCanvas user={user} />
          </Frame>
        </div>

        {/* Right sidebar with layer and settings */}
        {!isPreview && <RightBar />}
      </div>
    </>
  );
}
