"use client";

import type { BlogListFilters } from "@/lib/utils/blog-filters";
import { parseTagsInput, toLikePattern } from "@/lib/utils/blog-filters";
import { Button, Input, Label, Select, ListBox } from "@heroui/react";
import { useEffect, useState } from "react";

type BlogFiltersProps = {
  filters: BlogListFilters;
  onChange: (filters: BlogListFilters) => void;
  showPublishedFilter?: boolean;
  tagSuggestions?: string[];
};

export default function BlogFilters({
  filters,
  onChange,
  showPublishedFilter = false,
  tagSuggestions = [],
}: BlogFiltersProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    setTitle(filters.title?.replace(/^%|%$/g, "") ?? "");
    setAuthor(filters.author?.replace(/^%|%$/g, "") ?? "");
    setTags(filters.tags?.join(", ") ?? "");
  }, [filters.author, filters.tags, filters.title]);

  const applyFilters = () => {
    onChange({
      title: toLikePattern(title),
      author: toLikePattern(author),
      tags: parseTagsInput(tags),
      is_published: filters.is_published,
    });
  };

  const clearFilters = () => {
    setTitle("");
    setAuthor("");
    setTags("");
    onChange({});
  };

  const hasActiveFilters =
    Boolean(filters.title) ||
    Boolean(filters.author) ||
    Boolean(filters.tags?.length) ||
    filters.is_published !== undefined;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-1">
          <Label htmlFor="blog-filter-title">Title</Label>
          <Input
            id="blog-filter-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Search by title"
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters();
            }}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="blog-filter-author">Author</Label>
          <Input
            id="blog-filter-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Search by author"
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters();
            }}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="blog-filter-tags">Tags</Label>
          <Input
            id="blog-filter-tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Comma-separated tags"
            list={tagSuggestions.length > 0 ? "blog-tag-suggestions" : undefined}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters();
            }}
          />
          {tagSuggestions.length > 0 && (
            <datalist id="blog-tag-suggestions">
              {tagSuggestions.map((tag) => (
                <option key={tag} value={tag} />
              ))}
            </datalist>
          )}
        </div>
      </div>

      {showPublishedFilter && (
        <div className="max-w-xs space-y-1">
          <Label>Published status</Label>
          <Select
            aria-label="Published status"
            value={
              filters.is_published === undefined
                ? "all"
                : filters.is_published
                  ? "published"
                  : "draft"
            }
            onChange={(value) => {
              const next =
                value === "all"
                  ? undefined
                  : value === "published";
              onChange({
                ...filters,
                is_published: next,
              });
            }}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="all" textValue="All">
                  All
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="published" textValue="Published">
                  Published
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="draft" textValue="Draft">
                  Draft
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onPress={applyFilters}>
          Apply filters
        </Button>
        {hasActiveFilters && (
          <Button size="sm" variant="ghost" onPress={clearFilters}>
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
