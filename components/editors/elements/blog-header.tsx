"use client";

import { useNode, UserComponent } from "@craftjs/core";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BlogHeaderSchema } from "@/lib/schemas/blog";
import { Surface, TextField, Label, Input, Checkbox, cn } from "@heroui/react";
import {
  getHighlightedClassNames,
  HOVERED_CLASS_NAMES,
  SELECTED_CLASS_NAMES,
} from "../utils";

export type BlogHeaderElementProps = {
  title: string;
  description?: string;
  author: string;
  is_published: boolean;
  tags: string[];
};

export const BlogHeaderElement: UserComponent<BlogHeaderElementProps> = ({
  title,
  description,
  author,
  is_published,
  tags = [],
}) => {
  const {
    connectors: { connect },
    hasSelectedNode,
  } = useNode((state) => ({
    hasSelectedNode: state.events.selected,
  }));

  return (
    <header
      ref={(ref) => {
        if (ref) connect(ref);
      }}
      className={cn(
        "mb-8 pb-6 border-b border-separator",
        getHighlightedClassNames(hasSelectedNode),
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-4xl font-bold">{title}</h1>
        {is_published && (
          <span className="px-3 py-1 bg-success/10 text-success text-sm rounded-md">
            Published
          </span>
        )}
      </div>
      {description && <p className="text-lg text-muted mb-4">{description}</p>}
      <div className="flex items-center gap-4 text-sm text-muted">
        <span>By {author}</span>
        {tags && tags.length > 0 && (
          <div className="flex gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-surface-secondary rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export const BlogHeaderSettings = () => {
  const {
    title,
    description,
    author,
    is_published,
    tags,
    actions: { setProp },
  } = useNode((node) => ({
    title: node.data.props.title as string,
    description: node.data.props.description as string | undefined,
    author: node.data.props.author as string,
    is_published: node.data.props.is_published as boolean,
    tags: node.data.props.tags as string[],
  }));

  const {
    control,
    formState: { errors },
  } = useForm<z.input<typeof BlogHeaderSchema>>({
    resolver: zodResolver(BlogHeaderSchema),
    mode: "onChange",
    defaultValues: {
      title,
      description,
      author,
      is_published: is_published ?? false,
      tags: tags ?? [],
    },
  });

  return (
    <Surface className="space-y-4">
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField isInvalid={!!errors.title} isRequired>
            <Label>Title</Label>
            <Input
              {...field}
              onChange={(e) => {
                field.onChange(e);
                setProp((props: BlogHeaderElementProps) => {
                  props.title = e.target.value;
                });
              }}
            />
            {errors.title && (
              <span className="text-xs text-danger">
                {errors.title.message}
              </span>
            )}
          </TextField>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField>
            <Label>Description</Label>
            <textarea
              {...field}
              value={field.value || ""}
              onChange={(e) => {
                field.onChange(e);
                setProp((props: BlogHeaderElementProps) => {
                  props.description = e.target.value;
                });
              }}
              className="w-full px-3 py-2 border border-border rounded-md bg-field-background text-field-foreground"
              rows={3}
            />
          </TextField>
        )}
      />

      <Controller
        name="author"
        control={control}
        render={({ field }) => (
          <TextField isInvalid={!!errors.author} isRequired>
            <Label>Author</Label>
            <Input
              {...field}
              onChange={(e) => {
                field.onChange(e);
                setProp((props: BlogHeaderElementProps) => {
                  props.author = e.target.value;
                });
              }}
            />
            {errors.author && (
              <span className="text-xs text-danger">
                {errors.author.message}
              </span>
            )}
          </TextField>
        )}
      />

      <Controller
        name="is_published"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              isSelected={field.value}
              onChange={(checked) => {
                field.onChange(checked);
                setProp((props: BlogHeaderElementProps) => {
                  props.is_published = checked;
                });
              }}
            >
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>
                <Label>Published</Label>
              </Checkbox.Content>
            </Checkbox>
          </div>
        )}
      />

      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <TextField>
            <Label>Tags (comma-separated)</Label>
            <Input
              value={(field.value || []).join(", ")}
              onChange={(e) => {
                const newTags = e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean);
                field.onChange(newTags);
                setProp((props: BlogHeaderElementProps) => {
                  props.tags = newTags;
                });
              }}
              placeholder="react, typescript, tutorial"
            />
            {errors.tags && (
              <span className="text-xs text-danger">{errors.tags.message}</span>
            )}
          </TextField>
        )}
      />
    </Surface>
  );
};

BlogHeaderElement.craft = {
  displayName: "Blog Header",
  props: {
    title: "Untitled Blog Post",
    description: "",
    author: "Anonymous",
    tags: [],
  },
  rules: {
    canDrag: () => false,
    canDrop: () => false,
    canMoveIn: () => false,
    canMoveOut: () => false,
  },
  related: {
    settings: BlogHeaderSettings,
  },
};
