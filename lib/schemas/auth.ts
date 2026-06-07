import * as z from "zod";

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 6 characters long"),
});

export type LoginDto = z.infer<typeof LoginSchema>;

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(40, "Password must be at most 40 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol");

export const ChangePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    password: passwordSchema,
    password_confirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
