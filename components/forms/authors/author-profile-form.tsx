"use client";

import {
  CreateAuthorProfileDto,
  CreateAuthorProfileSchema,
  UpdateAuthorProfileDto,
  UpdateAuthorProfileSchema,
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
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { createGraphqlClient } from "@/lib/apis/modules/graphql";
import { createBrowserFetcher } from "@/lib/apis/fetchers/browser";

type AuthorProfileFormProps = {
  author?: AuthorProfile;
  formId?: string;
  onSubmit: (
    data: CreateAuthorProfileDto | UpdateAuthorProfileDto,
  ) => Promise<void>;
  submitLabel?: string;
  allowUserLinking?: boolean;
};

type UserOption = {
  id: string;
  name: string;
  email: string;
};

const fetcher = createBrowserFetcher();
const gql = createGraphqlClient(fetcher);

export default function AuthorProfileForm({
  author,
  formId = "author-profile-form",
  onSubmit,
  submitLabel = "Save author",
  allowUserLinking = true,
}: AuthorProfileFormProps) {
  const schema = author ? UpdateAuthorProfileSchema : CreateAuthorProfileSchema;
  const defaultLink = author?.user ? "existing" : "none";
  const [users, setUsers] = useState<UserOption[]>([]);

  const {
    control,
    handleSubmit,
    formState,
    setError,
    setValue,
  } = useForm({
    defaultValues: {
      name: author?.name ?? "",
      bio: author?.bio ?? "",
      user: author?.user
        ? { link: "existing" as const, user_id: Number(author.user.id) }
        : { link: defaultLink as "none" },
    },
    resolver: zodResolver(schema),
  });

  const linkMode = useWatch({ control, name: "user.link" });
  const isEditingLinkedProfile = Boolean(author?.user);

  useEffect(() => {
    if (!allowUserLinking || linkMode !== "existing") {
      return;
    }

    gql
      .request<{ users: { data: UserOption[] } }>(
        `query Users($first: Int!) {
          users(first: $first) {
            data {
              id
              name
              email
            }
          }
        }`,
        { first: 100 },
      )
      .then((response) => setUsers(response.users.data));
  }, [allowUserLinking, linkMode]);

  const userOptions = useMemo(
    () =>
      users.filter(
        (user) =>
          !author?.user || user.id !== author.user?.id,
      ),
    [users, author?.user],
  );

  const handleFormSubmit = async (
    data: CreateAuthorProfileDto | UpdateAuthorProfileDto,
  ) => {
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
      id={formId}
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

      {allowUserLinking && !isEditingLinkedProfile && (
        <Controller
          name="user.link"
          control={control}
          render={({ field }) => (
            <TextField aria-label="User account">
              <Label>User account</Label>
              <select
                className="w-full px-3 py-2 border border-border rounded-md bg-field-background"
                value={field.value ?? "none"}
                onChange={(event) => {
                  const value = event.target.value;

                  if (value === "none") {
                    setValue("user", { link: "none" });
                    return;
                  }

                  if (value === "existing") {
                    setValue("user", { link: "existing", user_id: 0 });
                    return;
                  }

                  setValue("user", {
                    link: "new",
                    name: "",
                    email: "",
                    password: "",
                    roles: ["author"],
                  });
                }}
              >
                <option value="none">No linked user</option>
                <option value="existing">Link existing user</option>
                <option value="new">Create new user</option>
              </select>
            </TextField>
          )}
        />
      )}

      {allowUserLinking && !isEditingLinkedProfile && linkMode === "existing" && (
        <Controller
          name="user.user_id"
          control={control}
          render={({ field, fieldState }) => (
            <TextField isInvalid={fieldState.invalid} aria-label="User">
              <Label>Existing user</Label>
              <select
                className="w-full px-3 py-2 border border-border rounded-md bg-field-background"
                value={field.value ? String(field.value) : ""}
                onChange={(event) =>
                  field.onChange(Number(event.target.value) || undefined)
                }
              >
                <option value="">Select a user</option>
                {userOptions.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
      )}

      {allowUserLinking && !isEditingLinkedProfile && linkMode === "new" && (
        <>
          <Controller
            name="user.name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField isInvalid={fieldState.invalid} aria-label="User name">
                <Label>User name</Label>
                <Input {...field} />
                <FieldError>{fieldState.error?.message}</FieldError>
              </TextField>
            )}
          />
          <Controller
            name="user.email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField isInvalid={fieldState.invalid} aria-label="User email">
                <Label>User email</Label>
                <Input {...field} type="email" />
                <FieldError>{fieldState.error?.message}</FieldError>
              </TextField>
            )}
          />
          <Controller
            name="user.password"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                isInvalid={fieldState.invalid}
                aria-label="User password"
              >
                <Label>User password</Label>
                <Input {...field} type="password" />
                <FieldError>{fieldState.error?.message}</FieldError>
              </TextField>
            )}
          />
        </>
      )}

      {author?.user && (
        <div className="rounded-md border border-border p-4 text-sm space-y-1">
          <p className="font-medium">Linked user</p>
          <p>{author.user.name}</p>
          <p className="text-muted">{author.user.email}</p>
        </div>
      )}

      {errors.root?.serverError && (
        <p>
          <ErrorMessage>{errors.root.serverError.message}</ErrorMessage>
        </p>
      )}

      <Button type="submit" isPending={isSubmitting}>
        {submitLabel}
      </Button>
    </Form>
  );
}
