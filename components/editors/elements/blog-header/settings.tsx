"use client";

import { useNode } from "@craftjs/core";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BlogHeaderSchema } from "@/lib/schemas/blog";
import { Surface, TextField, Label, Input, Checkbox, Button } from "@heroui/react";
import TagsField from "@/components/forms/fields/tags-field";
import {
  AssetManagerModal,
  useAssetManagerModal,
} from "@/components/editors/asset-manager";
import { ImagePositionPicker } from "@/components/editors/asset-manager/image-position-picker";
import type { BlogHeaderElementProps } from "./types";

export const BlogHeaderSettings = () => {
  const {
    title,
    description,
    author_name,
    author_bio,
    is_published,
    tags,
    hero_src,
    hero_object_position,
    actions: { setProp },
  } = useNode((node) => ({
    title: node.data.props.title as string,
    description: node.data.props.description as string | undefined,
    author_name: node.data.props.author_name as string,
    author_bio: node.data.props.author_bio as string | undefined,
    is_published: node.data.props.is_published as boolean,
    tags: node.data.props.tags as string[],
    hero_src: node.data.props.hero_src as string | undefined,
    hero_object_position: node.data.props.hero_object_position as
      | string
      | undefined,
  }));

  const heroModal = useAssetManagerModal();

  const {
    control,
    formState: { errors },
  } = useForm<z.input<typeof BlogHeaderSchema>>({
    resolver: zodResolver(BlogHeaderSchema),
    mode: "onChange",
    defaultValues: {
      title,
      description,
      author_profile: {
        name: author_name,
        bio: author_bio ?? "",
      },
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

      <div className="space-y-2">
        <Label>Hero image</Label>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onPress={heroModal.open}>
            {hero_src ? "Change hero image" : "Choose hero image"}
          </Button>
          {hero_src && (
            <Button
              variant="ghost"
              size="sm"
              onPress={() =>
                setProp((props: BlogHeaderElementProps) => {
                  props.hero_asset_uuid = undefined;
                  props.hero_src = undefined;
                })
              }
            >
              Remove
            </Button>
          )}
        </div>
        {hero_src && (
          <ImagePositionPicker
            src={hero_src}
            value={hero_object_position ?? "50% 50%"}
            onChange={(position) =>
              setProp((props: BlogHeaderElementProps) => {
                props.hero_object_position = position;
              })
            }
          />
        )}
      </div>

      <AssetManagerModal
        isOpen={heroModal.isOpen}
        onOpenChange={heroModal.setOpen}
        onSelect={(asset) =>
          setProp((props: BlogHeaderElementProps) => {
            props.hero_asset_uuid = asset.uuid;
            props.hero_src = asset.media?.url;
            props.hero_object_position = props.hero_object_position ?? "50% 50%";
          })
        }
      />

      <Controller
        name="author_profile.name"
        control={control}
        render={({ field }) => (
          <TextField isInvalid={!!errors.author_profile?.name} isRequired>
            <Label>Author name</Label>
            <Input
              {...field}
              onChange={(e) => {
                field.onChange(e);
                setProp((props: BlogHeaderElementProps) => {
                  props.author_name = e.target.value;
                });
              }}
            />
            {errors.author_profile?.name && (
              <span className="text-xs text-danger">
                {errors.author_profile.name.message}
              </span>
            )}
          </TextField>
        )}
      />

      <Controller
        name="author_profile.bio"
        control={control}
        render={({ field }) => (
          <TextField>
            <Label>Author bio</Label>
            <textarea
              {...field}
              value={field.value || ""}
              onChange={(e) => {
                field.onChange(e);
                setProp((props: BlogHeaderElementProps) => {
                  props.author_bio = e.target.value;
                });
              }}
              className="w-full px-3 py-2 border border-border rounded-md bg-field-background text-field-foreground"
              rows={3}
            />
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
