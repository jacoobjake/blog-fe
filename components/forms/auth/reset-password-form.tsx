"use client";

import { ResetPasswordDto, ResetPasswordSchema } from "@/lib/schemas";
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
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

type ResetPasswordFormProps = {
  email: string;
  token: string;
};

export default function ResetPasswordForm({ email, token }: ResetPasswordFormProps) {
  const router = useRouter();
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState,
    setError,
  } = useForm({
    defaultValues: {
      email,
      token,
      password: "",
      password_confirmation: "",
    },
    resolver: zodResolver(ResetPasswordSchema),
  });

  const { errors, isSubmitting } = formState;

  const handleSubmit = async (data: ResetPasswordDto) => {
    try {
      await authApi.resetPassword(data);
      router.push("/admin/login");
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
      <p className="text-center font-bold">Reset password</p>
      <p className="text-sm text-muted text-center">
        Choose a new password for <strong>{email}</strong>.
      </p>

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
        <p className="text-center">
          <ErrorMessage>{errors.root.serverError.message}</ErrorMessage>
        </p>
      )}

      <Button type="submit" className="w-full" isPending={isSubmitting}>
        Reset password
      </Button>

      <p className="text-center text-sm">
        <Link href="/admin/login" className="text-accent hover:underline">
          Back to login
        </Link>
      </p>
    </Form>
  );
}
