"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { useEditor } from "@craftjs/core";

import { blogApi } from "@/lib/apis/browser";
import {
  buildBlogPayload,
  getSerializedEditorState,
} from "@/lib/editors/build-blog-payload";
import type { Blog } from "@/lib/types";

export type AutoSaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

type EditorQuery = ReturnType<typeof useEditor>["query"];

type UseBlogAutoSaveOptions = {
  blog?: Blog;
  query: EditorQuery;
  enabled?: boolean;
  isReady?: boolean;
  debounceMs?: number;
};

export function useBlogAutoSave({
  blog,
  query,
  enabled = true,
  isReady = true,
  debounceMs = 3000,
}: UseBlogAutoSaveOptions) {
  const router = useRouter();
  const [status, setStatus] = useState<AutoSaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const currentSlugRef = useRef(blog?.slug);
  const lastSavedSnapshotRef = useRef<string | null>(null);
  const serverPublishStateRef = useRef(blog?.is_published ?? false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);
  const hasInitializedSnapshotRef = useRef(false);

  useEffect(() => {
    currentSlugRef.current = blog?.slug;
    serverPublishStateRef.current = blog?.is_published ?? false;
  }, [blog?.slug, blog?.is_published]);

  useEffect(() => {
    if (!isReady || hasInitializedSnapshotRef.current) return;

    lastSavedSnapshotRef.current = getSerializedEditorState(query);
    hasInitializedSnapshotRef.current = true;
    setHasUnsavedChanges(false);
    setStatus("saved");
  }, [isReady, query]);

  const performSave = useCallback(async () => {
    if (!enabled || !isReady || isSavingRef.current) return;

    const payload = buildBlogPayload(query, {
      preservePublishState: true,
      serverPublishState: serverPublishStateRef.current,
    });
    if (!payload) return;

    const currentSnapshot = getSerializedEditorState(query);
    if (currentSnapshot === lastSavedSnapshotRef.current) {
      setHasUnsavedChanges(false);
      setStatus("saved");
      return;
    }

    isSavingRef.current = true;
    setStatus("saving");

    try {
      const slug = currentSlugRef.current;

      if (slug) {
        const result = await blogApi.updateBlog(slug, payload);
        if (result.slug !== slug) {
          currentSlugRef.current = result.slug;
          router.replace(`/admin/editor/blogs?slug=${result.slug}`);
        }
      } else {
        const result = await blogApi.createBlog({
          ...payload,
          is_published: false,
        });
        currentSlugRef.current = result.slug;
        router.replace(`/admin/editor/blogs?slug=${result.slug}`);
      }

      lastSavedSnapshotRef.current = currentSnapshot;
      setLastSavedAt(new Date());
      setHasUnsavedChanges(false);
      setStatus("saved");
    } catch (error) {
      console.error("Auto-save failed:", error);
      setStatus("error");
    } finally {
      isSavingRef.current = false;
    }
  }, [enabled, isReady, query, router]);

  const scheduleSave = useCallback(() => {
    if (!enabled || !isReady) return;

    const currentSnapshot = getSerializedEditorState(query);
    if (currentSnapshot !== lastSavedSnapshotRef.current) {
      setHasUnsavedChanges(true);
      setStatus("pending");
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      void performSave();
    }, debounceMs);
  }, [debounceMs, enabled, isReady, performSave, query]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const markSaved = useCallback((snapshot?: string) => {
    lastSavedSnapshotRef.current = snapshot ?? getSerializedEditorState(query);
    setLastSavedAt(new Date());
    setHasUnsavedChanges(false);
    setStatus("saved");
  }, [query]);

  return {
    status,
    lastSavedAt,
    hasUnsavedChanges,
    scheduleSave,
    markSaved,
  };
}
