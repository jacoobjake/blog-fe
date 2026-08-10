"use client";

import { UpdateBlogMetadataDto, UpdateBlogMetadataSchema } from "@/lib/schemas/blog";
import { Blog } from "@/lib/types";
import { formatError } from "@/lib/utils/api-error";
import {
  ErrorMessage,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import TagsField from "../fields/tags-field";

type BlogDetailsFormProps = {
  blog: Blog;
  formId?: string;
  onSubmit: (data: UpdateBlogMetadataDto) => Promise<void>;
  readOnly?: boolean;
};

export default function BlogDetailsForm({
  blog,
  formId = "blog-details-form",
  onSubmit,
  readOnly = false,
}: BlogDetailsFormProps) {
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState,
    setError,
  } = useForm({
    defaultValues: {
      title: blog.title,
      author_profile: {
        name: blog.author_profile.name,
        bio: blog.author_profile.bio ?? "",
      },
      description: blog.description ?? "",
      tags: blog.tags.map((t) => t.name || ""),
    },
    resolver: zodResolver(UpdateBlogMetadataSchema),
  });

  const { errors, isSubmitting } = formState;

  const handleSubmit = async (data: UpdateBlogMetadataDto) => {
    try {
      await onSubmit(data);
    } catch (e) {
      const formatted = formatError(e);
      setError("root.serverError", {
        type: formatted.status.toString(),
        message: formatted.message,
      });
    }
  };

  return (
    <Form
      id={formId}
      className="w-full max-w-2xl space-y-4"
      onSubmit={handleFormSubmit(handleSubmit)}
    >
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            isInvalid={fieldState.invalid}
            aria-label="Title"
            type="text"
          >
            <Label>Title</Label>
            <Input {...field} disabled={readOnly} />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      <Controller
        name="author_profile.name"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            isInvalid={fieldState.invalid}
            aria-label="Author name"
            type="text"
          >
            <Label>Author name</Label>
            <Input {...field} disabled={readOnly} />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      <Controller
        name="author_profile.bio"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            isInvalid={fieldState.invalid}
            aria-label="Author bio"
            type="text"
          >
            <Label>Author bio</Label>
            <textarea
              {...field}
              value={field.value ?? ""}
              disabled={readOnly}
              className="w-full px-3 py-2 border border-border rounded-md bg-field-background text-field-foreground"
              rows={3}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            isInvalid={fieldState.invalid}
            aria-label="Description"
            type="text"
          >
            <Label>Description</Label>
            <Input {...field} value={field.value ?? ""} disabled={readOnly} />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      <Controller
        name="tags"
        control={control}
        render={({ field, fieldState }) => (
          <TagsField
            name={field.name}
            value={field.value ?? []}
            onChange={field.onChange}
            onBlur={field.onBlur}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error?.message}
            aria-label="Tags"
          />
        )}
      />

      {errors.root?.serverError && (
        <p>
          <ErrorMessage>{errors.root.serverError.message}</ErrorMessage>
        </p>
      )}

      <button type="submit" className="sr-only" disabled={isSubmitting}>
        Save
      </button>
    </Form>
  );
}
