"use client";

import { Blog, BlogContentType } from "@/lib/types";
import type { BlogHeaderElementProps } from "./elements/blog-header/types";
import { Editor, Frame, useEditor } from "@craftjs/core";
import {
  TextElement,
  ContainerElement,
  ButtonElement,
  BlogHeaderElement,
  RootCanvas,
  SpacerElement,
  ImageElement,
  TwoColumnElement,
} from "./elements";
import { Topbar } from "./toolbars/topbar";
import { ReactNode, useEffect, useState } from "react";
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
      const description = blogHeaderNode?.data.props.description || "";
      const author_name = blogHeaderNode?.data.props.author_name || "";
      const author_bio = blogHeaderNode?.data.props.author_bio || "";
      const tags = blogHeaderNode?.data.props.tags || [];
      const is_published = blogHeaderNode?.data.props.is_published || false;
      const hero_asset_uuid =
        blogHeaderNode?.data.props.hero_asset_uuid || null;

      // Compress the JSON content
      const compressed = lz.compressToBase64(json);

      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        author_profile: {
          name: author_name.trim(),
          bio: author_bio.trim() || null,
        },
        json_content: {
          type: BlogContentType.CompressedBase64,
          body: compressed,
        },
        hero_asset_uuid,
        is_published: is_published,
        tags: tags.filter((tag: string) => tag.trim() !== ""),
      };

      if (blog?.slug) {
        // Update existing blog
        await updateBlogAction(blog.slug, payload);
      } else {
        // Create new blog
        const response = await createBlogAction(payload);

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
      ImageElement,
      TwoColumnElement,
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

  useEffect(() => {
    if (!blog) return;

    const nodes = query.getNodes();
    const blogHeaderEntry = Object.entries(nodes).find(
      ([, node]) => node.data.name === "BlogHeaderElement",
    );

    if (!blogHeaderEntry) return;

    const [nodeId] = blogHeaderEntry;

    actions.setProp(nodeId, (props: BlogHeaderElementProps) => {
      if (blog.description) {
        props.description = blog.description;
      }

      if (blog.created_at) {
        props.created_at = blog.created_at;
      }

      if (blog.hero_asset?.media?.url) {
        props.hero_asset_uuid = blog.hero_asset.uuid;
        props.hero_src = blog.hero_asset.media.url;
        props.hero_object_position = props.hero_object_position ?? "50% 50%";
      }

      if (blog.author_profile?.name) {
        props.author_name = blog.author_profile.name;
        props.author_bio = blog.author_profile.bio ?? "";
      }
    });
  }, [actions, blog, query]);

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
