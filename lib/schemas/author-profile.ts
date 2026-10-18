import * as z from "zod";

const AuthorUserLinkSchema = z.discriminatedUnion("link", [
  z.object({
    link: z.literal("none"),
  }),
  z.object({
    link: z.literal("existing"),
    user_id: z.coerce.number().int().positive("Select a user"),
  }),
  z.object({
    link: z.literal("new"),
    name: z.string().min(1, "Name is required").max(255),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    roles: z.array(z.string()).default(["author"]),
  }),
]);

export const AuthorProfileFieldsSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  bio: z.string().nullable().optional(),
});

export const CreateAuthorProfileSchema = AuthorProfileFieldsSchema.extend({
  user: AuthorUserLinkSchema.optional(),
});

export type CreateAuthorProfileDto = z.infer<typeof CreateAuthorProfileSchema>;

export const UpdateAuthorProfileSchema = AuthorProfileFieldsSchema.partial().extend({
  user: AuthorUserLinkSchema.optional(),
});

export type UpdateAuthorProfileDto = z.infer<typeof UpdateAuthorProfileSchema>;

export const UpdateOwnAuthorProfileSchema = AuthorProfileFieldsSchema;

export type UpdateOwnAuthorProfileDto = z.infer<
  typeof UpdateOwnAuthorProfileSchema
>;
