"use client";

import { ForgotPasswordDto, ForgotPasswordSchema } from "@/lib/schemas";
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
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function ForgotPasswordForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState,
    setError,
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const { errors, isSubmitting } = formState;

  const handleSubmit = async (data: ForgotPasswordDto) => {
    setSuccessMessage(null);

    try {
      await authApi.forgotPassword(data);
      setSuccessMessage(
        "If an account exists for that email, a reset link has been sent.",
      );
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
      className="w-2/3 md:w-2/5 max-w-md p-12 rounded-4xl bg-background-secondary space-y-6"
      onSubmit={handleFormSubmit(handleSubmit)}
    >
      <p className="text-center font-bold">Forgot password</p>
      <p className="text-sm text-muted text-center">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            isInvalid={fieldState.invalid}
            aria-label="Email"
            type="email"
          >
            <Label>Email</Label>
            <Input {...field} />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      {errors.root?.serverError && (
        <p className="text-center">
          <ErrorMessage>{errors.root.serverError.message}</ErrorMessage>
        </p>
      )}

      {successMessage && (
        <p className="text-sm text-success text-center">{successMessage}</p>
      )}

      <Button type="submit" className="w-full" isPending={isSubmitting}>
        Send reset link
      </Button>

      <p className="text-center text-sm">
        <Link href="/admin/login" className="text-accent hover:underline">
          Back to login
        </Link>
      </p>
    </Form>
  );
}
