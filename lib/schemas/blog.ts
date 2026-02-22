import * as z from "zod";

export const CreateBlogSchema = z.object({
  title: z.string().max(255),
  json_content: z.array(z.any()),
  author: z.string().max(255),
  is_published: z.boolean().default(false),
  tags: z.array(z.string()).nullable(),
});

export type CreateBlogDto = z.infer<typeof CreateBlogSchema>;

export const UpdateBlogSchema = CreateBlogSchema;

export type UpdateBlogDto = z.infer<typeof UpdateBlogSchema>;
