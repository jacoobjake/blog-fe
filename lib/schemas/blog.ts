import * as z from "zod";
import { BlogContentType } from "@/lib/types";

const JsonContentSchema = z.union([
  z.object({
    type: z.literal(BlogContentType.CompressedBase64),
    body: z.string(),
  }),
]);

const AuthorProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Author name is required")
    .max(255, "Author name must be less than 255 characters"),
  bio: z.string().nullable().optional(),
});

export const BlogHeaderSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  author_profile: AuthorProfileSchema,
  description: z.string().optional(),
  is_published: z.boolean().default(false),
  tags: z
    .array(z.string().max(255, "Each tag must be less than 255 characters"))
    .default([]),
});

export type BlogHeaderDto = z.output<typeof BlogHeaderSchema>;

export const CreateBlogSchema = z.object({
  title: z.string().max(255),
  description: z.string().nullable().optional(),
  json_content: JsonContentSchema,
  hero_asset_uuid: z.string().uuid().nullable().optional(),
  author_profile: AuthorProfileSchema,
  is_published: z.boolean().default(false),
  tags: z.array(z.string()).nullable(),
});

export type CreateBlogDto = z.infer<typeof CreateBlogSchema>;

export const UpdateBlogSchema = CreateBlogSchema;

export type UpdateBlogDto = z.infer<typeof UpdateBlogSchema>;

export const UpdateBlogMetadataSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  author_profile: AuthorProfileSchema,
  description: z.string().nullable().optional(),
  tags: z
    .array(z.string().max(255, "Each tag must be less than 255 characters"))
    .default([]),
});

export type UpdateBlogMetadataDto = z.infer<typeof UpdateBlogMetadataSchema>;
