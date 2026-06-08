"use client";

import { useNode } from "@craftjs/core";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BlogHeaderSchema } from "@/lib/schemas/blog";
import { Surface, TextField, Label, Input, Checkbox } from "@heroui/react";
import TagsField from "@/components/forms/fields/tags-field";
import type { BlogHeaderElementProps } from "./types";

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
          <TagsField
            value={field.value ?? []}
            onChange={(newTags) => {
              field.onChange(newTags);
              setProp((props: BlogHeaderElementProps) => {
                props.tags = newTags;
              });
            }}
            onBlur={field.onBlur}
            isInvalid={!!errors.tags}
            errorMessage={errors.tags?.message}
            placeholder="react, typescript, tutorial"
          />
        )}
      />
    </Surface>
  );
};
