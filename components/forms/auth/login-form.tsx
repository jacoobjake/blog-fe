"use client";

import { LoginDto, LoginSchema } from "@/lib/schemas";
import {
  Button,
  cn,
  ErrorMessage,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
  type FormProps,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { formatError } from "@/lib/utils/api-error";
import { useAuth } from "@/hooks/auth";

export default function LoginForm({ className, ...props }: FormProps) {
  const { login } = useAuth();
  const router = useRouter();
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState,
    setError,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const { errors, isSubmitting } = formState;

  const handleSubmit = async (data: LoginDto) => {
    try {
      await login(data);
      router.push("/admin");
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
      className={cn(
        "w-2/3 md:w-2/5 max-w-md p-12 rounded-4xl bg-background-secondary space-y-6",
        className,
      )}
      {...props}
      onSubmit={handleFormSubmit(handleSubmit)}
    >
      <p className="text-center font-bold">Welcome Back</p>
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

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            isInvalid={fieldState.invalid}
            aria-label="Password"
            type="password"
          >
            <Label>Password</Label>
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

      <Button type="submit" className={"w-full"} isPending={isSubmitting}>
        Login
      </Button>
    </Form>
  );
}
