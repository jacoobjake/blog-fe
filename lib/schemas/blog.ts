import * as z from "zod";

const JsonContentSchema = z.union([
  z.object({
    type: z.literal("compressed_base64"),
    body: z.string(),
  }),
]);

export const BlogHeaderSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  author: z
    .string()
    .min(1, "Author is required")
    .max(255, "Author must be less than 255 characters"),
  description: z.string().optional(),
  is_published: z.boolean().default(false),
  tags: z
    .array(z.string().max(255, "Each tag must be less than 255 characters"))
    .default([]),
});

export type BlogHeaderDto = z.output<typeof BlogHeaderSchema>;

export const CreateBlogSchema = z.object({
  title: z.string().max(255),
  json_content: JsonContentSchema,
  author: z.string().max(255),
  is_published: z.boolean().default(false),
  tags: z.array(z.string()).nullable(),
});

export type CreateBlogDto = z.infer<typeof CreateBlogSchema>;

export const UpdateBlogSchema = CreateBlogSchema;

export type UpdateBlogDto = z.infer<typeof UpdateBlogSchema>;
