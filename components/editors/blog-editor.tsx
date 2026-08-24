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
import { ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import lz from "lz-string";
import { createBlogAction, updateBlogAction } from "@/lib/actions";
import { buildBlogPayload } from "@/lib/editors/build-blog-payload";
import RightBar from "./toolbars/right-bar";
import LeftBar from "./toolbars/left-bar";
import { RenderNode } from "./render-node";
import { useAuthStore } from "@/hooks/auth";
import {
  useBlogAutoSave,
  useBlogEditorCrumbs,
  useBlogHeaderTitle,
  useSessionKeepAlive,
} from "@/hooks/editors";
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
      return typeof body === "string" ? body : JSON.stringify(body);
  }
}

export default function BlogEditor({ blog }: BlogEditorProps) {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const scheduleSaveRef = useRef<() => void>(() => {});

  const handlePreview = () => {
    setIsPreview(!isPreview);
  };

  const handleFinish = async (
    query: ReturnType<typeof useEditor>["query"],
  ) => {
    setIsSaving(true);
    try {
      const payload = buildBlogPayload(query);
      if (!payload) {
        alert("Title and author are required before saving.");
        return;
      }

      if (blog?.slug) {
        await updateBlogAction(blog.slug, payload);
      } else {
        const response = await createBlogAction(payload);
        router.push(`/admin/editor/blogs?slug=${response.slug}`);
        return;
      }
    } catch (error) {
      console.error("Failed to save blog:", error);
      alert("Failed to save blog. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-background overflow-hidden">
      <EditorContainer
        enabled={!isPreview}
        onNodesChange={() => scheduleSaveRef.current()}
      >
        <EditorContent
          blog={blog}
          isPreview={isPreview}
          isSaving={isSaving}
          onPreview={handlePreview}
          onFinish={handleFinish}
          scheduleSaveRef={scheduleSaveRef}
        />
      </EditorContainer>
    </div>
  );
}

export function BlogContentViewer({ blog }: { blog: Blog }) {
  return (
    <EditorContainer enabled={false}>
      <Frame data={deserializeBlogContent(blog)} />
    </EditorContainer>
  );
}

function EditorContainer({
  enabled,
  onNodesChange,
  children,
}: {
  enabled: boolean;
  onNodesChange?: () => void;
  children: ReactNode;
}) {
  return (
    <Editor
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
      onNodesChange={onNodesChange}
    >
      {children}
    </Editor>
  );
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
  scheduleSaveRef,
}: {
  blog?: Blog;
  isPreview: boolean;
  isSaving: boolean;
  onPreview: () => void;
  onFinish: (query: ReturnType<typeof useEditor>["query"]) => Promise<void>;
  scheduleSaveRef: React.MutableRefObject<() => void>;
}) {
  const { query, actions } = useEditor();
  const user = useAuthStore((s) => s.user ?? undefined);
  const title = useBlogHeaderTitle();
  const [isEditorReady, setIsEditorReady] = useState(!blog);

  useSessionKeepAlive();

  const {
    status: autoSaveStatus,
    lastSavedAt,
    hasUnsavedChanges,
    scheduleSave,
    markSaved,
  } = useBlogAutoSave({
    blog,
    query,
    enabled: !isPreview,
    isReady: isEditorReady,
  });

  useEffect(() => {
    scheduleSaveRef.current = scheduleSave;
  }, [scheduleSave, scheduleSaveRef]);

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
    });

    const timer = window.setTimeout(() => {
      setIsEditorReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [actions, blog, query]);

  const handleFinishClick = async () => {
    await onFinish(query);
    markSaved();
  };

  return (
    <>
      <Topbar
        isPreview={isPreview}
        onPreview={onPreview}
        onFinish={handleFinishClick}
        isSaving={isSaving}
        autoSaveStatus={autoSaveStatus}
        lastSavedAt={lastSavedAt}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      <div className="flex flex-1 overflow-hidden">
        {!isPreview && <LeftBar />}
        <div className="flex-1 overflow-y-auto page-container w-full max-w-5xl mx-auto p-6">
          <BlogEditorBreadcrumbs slug={blog?.slug} title={title} />
          <Frame data={blog ? deserializeBlogContent(blog) : undefined}>
            <RootCanvas user={user} />
          </Frame>
        </div>
        {!isPreview && <RightBar />}
      </div>
    </>
  );
}
