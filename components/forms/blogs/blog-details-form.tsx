"use client";

import { CreateBlogSchema } from "@/lib/schemas/blog";
import { Blog } from "@/lib/types";
import { FieldError, Form, Input, Key, Label, TextField } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import TagsField from "../fields/tags-field";

type BlogDetailsFormProps =
  | {
      type: "create";
      blog: undefined;
    }
  | {
      type: "edit";
      blog: Blog;
    };

export default function BlogDetailsForm({ type, blog }: BlogDetailsFormProps) {
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState,
    setError,
  } = useForm({
    defaultValues: {
      title: blog?.title || "",
      json_content: blog?.json_content ?? undefined,
      author: blog?.author || "",
      tags: blog?.tags.map((t) => t.name || "") || [],
    },
    resolver: zodResolver(CreateBlogSchema),
  });

  const { errors, isSubmitting } = formState;

  return (
    <Form className="w-full space-y-4">
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
            <Input {...field} />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      <Controller
        name="author"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            isInvalid={fieldState.invalid}
            aria-label="Author"
            type="text"
          >
            <Label>Author</Label>
            <Input {...field} />
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
    </Form>
  );
}
