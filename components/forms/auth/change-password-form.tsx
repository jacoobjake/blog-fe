"use client";

import { ChangePasswordDto, ChangePasswordSchema } from "@/lib/schemas";
import { authApi } from "@/lib/apis";
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
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function ChangePasswordForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState,
    setError,
    reset,
  } = useForm({
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
    resolver: zodResolver(ChangePasswordSchema),
  });

  const { errors, isSubmitting } = formState;

  const handleSubmit = async (data: ChangePasswordDto) => {
    setSuccessMessage(null);

    try {
      await authApi.updatePassword(data);
      reset();
      setSuccessMessage("Password updated successfully.");
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
      className="w-full max-w-md space-y-4"
      onSubmit={handleFormSubmit(handleSubmit)}
    >
      <Controller
        name="current_password"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            isInvalid={fieldState.invalid}
            aria-label="Current password"
            type="password"
          >
            <Label>Current password</Label>
            <Input {...field} />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            isInvalid={fieldState.invalid}
            aria-label="New password"
            type="password"
          >
            <Label>New password</Label>
            <Input {...field} />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      <Controller
        name="password_confirmation"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            isInvalid={fieldState.invalid}
            aria-label="Confirm new password"
            type="password"
          >
            <Label>Confirm new password</Label>
            <Input {...field} />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      {errors.root?.serverError && (
        <p>
          <ErrorMessage>{errors.root.serverError.message}</ErrorMessage>
        </p>
      )}

      {successMessage && (
        <p className="text-success text-sm">{successMessage}</p>
      )}

      <Button type="submit" isPending={isSubmitting}>
        Update password
      </Button>
    </Form>
  );
}
