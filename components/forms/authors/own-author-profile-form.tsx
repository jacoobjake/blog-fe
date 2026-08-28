"use client";

import {
  UpdateOwnAuthorProfileDto,
  UpdateOwnAuthorProfileSchema,
} from "@/lib/schemas/author-profile";
import type { AuthorProfile } from "@/lib/types";
import { formatError } from "@/lib/utils/api-error";
import {
  FieldError,
  Form,
  Input,
  Label,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

type OwnAuthorProfileFormProps = {
  author: AuthorProfile;
  formId?: string;
  onSubmit: (data: UpdateOwnAuthorProfileDto) => Promise<void>;
};

export default function OwnAuthorProfileForm({
  author,
  formId = "own-author-profile-form",
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
      toast.danger(formatted.message);
      setError("root.serverError", {
        type: formatted.status.toString(),
        message: formatted.message,
      });
    }
  };

  const { errors } = formState;

  return (
    <Form
      id={formId}
      className="w-full max-w-2xl space-y-4"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <TextField isInvalid={fieldState.invalid} isRequired>
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
          <TextField isInvalid={fieldState.invalid}>
            <Label>Bio</Label>
            <TextArea
              {...field}
              value={field.value ?? ""}
              rows={4}
              fullWidth
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      {errors.root?.serverError && (
        <p className="sr-only">{errors.root.serverError.message}</p>
      )}
    </Form>
  );
}
