"use client";

import type { BlogListFilters } from "@/lib/utils/blog-filters";
import { parseTagsInput, toLikePattern } from "@/lib/utils/blog-filters";
import {
  Button,
  Checkbox,
  Input,
  Label,
  Separator,
  TextField,
} from "@heroui/react";
import { useEffect, useState } from "react";

type BlogFiltersProps = {
  filters: BlogListFilters;
  onChange: (filters: BlogListFilters) => void;
  showPublishedFilter?: boolean;
  tagSuggestions?: string[];
  /** `panel` = card (admin). `naked` = separators (public). */
  variant?: "panel" | "naked";
};

export default function BlogFilters({
  filters,
  onChange,
  showPublishedFilter = false,
  tagSuggestions = [],
  variant = "panel",
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

  const fields = (
    <>
      <div className="grid gap-3 md:grid-cols-3">
        <TextField
          name="title"
          value={title}
          onChange={setTitle}
          className="w-full"
        >
          <Label>Title</Label>
          <Input
            placeholder="Search by title"
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters();
            }}
          />
        </TextField>

        <TextField
          name="author"
          value={author}
          onChange={setAuthor}
          className="w-full"
        >
          <Label>Author</Label>
          <Input
            placeholder="Search by author"
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters();
            }}
          />
        </TextField>

        <TextField
          name="tags"
          value={tags}
          onChange={setTags}
          className="w-full"
        >
          <Label>Tags</Label>
          <Input
            placeholder="Comma-separated tags"
            list={
              tagSuggestions.length > 0 ? "blog-tag-suggestions" : undefined
            }
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
        </TextField>
      </div>

      {showPublishedFilter && (
        <Checkbox
          isSelected={filters.is_published === true}
          onChange={(isSelected) => {
            onChange({
              ...filters,
              is_published: isSelected ? true : undefined,
            });
          }}
        >
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label>Published only</Label>
          </Checkbox.Content>
        </Checkbox>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          size="sm"
          variant="ghost"
          isDisabled={!hasActiveFilters}
          onPress={clearFilters}
        >
          Clear
        </Button>
        <Button size="sm" onPress={applyFilters}>
          Apply filters
        </Button>
      </div>
    </>
  );

  if (variant === "naked") {
    return (
      <div className="flex flex-col gap-4">
        <Separator />
        {fields}
        <Separator />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
      {fields}
    </div>
  );
}
