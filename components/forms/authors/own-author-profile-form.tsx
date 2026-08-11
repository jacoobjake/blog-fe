"use client";

import {
  UpdateOwnAuthorProfileDto,
  UpdateOwnAuthorProfileSchema,
} from "@/lib/schemas/author-profile";
import type { AuthorProfile } from "@/lib/types";
import { formatError } from "@/lib/utils/api-error";
import {
  Button,
  ErrorMessage,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

type OwnAuthorProfileFormProps = {
  author: AuthorProfile;
  onSubmit: (data: UpdateOwnAuthorProfileDto) => Promise<void>;
};

export default function OwnAuthorProfileForm({
  author,
  onSubmit,
}: OwnAuthorProfileFormProps) {
  const {
    control,
    handleSubmit,
    formState,
    setError,
  } = useForm({
    defaultValues: {
      name: author.name,
      bio: author.bio ?? "",
    },
    resolver: zodResolver(UpdateOwnAuthorProfileSchema),
  });

  const handleFormSubmit = async (data: UpdateOwnAuthorProfileDto) => {
    try {
      await onSubmit(data);
    } catch (error) {
      const formatted = formatError(error);
      setError("root.serverError", {
        type: formatted.status.toString(),
        message: formatted.message,
      });
    }
  };

  const { errors, isSubmitting } = formState;

  return (
    <Form
      className="w-full max-w-2xl space-y-4"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <TextField isInvalid={fieldState.invalid} aria-label="Name" type="text">
            <Label>Name</Label>
            <Input {...field} />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      <Controller
        name="bio"
        control={control}
        render={({ field, fieldState }) => (
          <TextField isInvalid={fieldState.invalid} aria-label="Bio" type="text">
            <Label>Bio</Label>
            <textarea
              {...field}
              value={field.value ?? ""}
              className="w-full px-3 py-2 border border-border rounded-md bg-field-background text-field-foreground"
              rows={4}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      {errors.root?.serverError && (
        <p>
          <ErrorMessage>{errors.root.serverError.message}</ErrorMessage>
        </p>
      )}

      <Button type="submit" isPending={isSubmitting}>
        Save profile
      </Button>
    </Form>
  );
}
