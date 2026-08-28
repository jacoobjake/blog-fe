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
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
  toast,
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
  allowUserLinking?: boolean;
};

type UserOption = {
  id: string;
  name: string;
  email: string;
};

type UserLinkMode = "none" | "existing" | "new";

const USER_LINK_OPTIONS: { id: UserLinkMode; label: string }[] = [
  { id: "none", label: "No linked user" },
  { id: "existing", label: "Link existing user" },
  { id: "new", label: "Create new user" },
];

const fetcher = createBrowserFetcher();
const gql = createGraphqlClient(fetcher);

export default function AuthorProfileForm({
  author,
  formId = "author-profile-form",
  onSubmit,
  allowUserLinking = true,
}: AuthorProfileFormProps) {
  const schema = author ? UpdateAuthorProfileSchema : CreateAuthorProfileSchema;
  const defaultLink: UserLinkMode = author?.user ? "existing" : "none";
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
      ...(allowUserLinking
        ? {
            user: author?.user
              ? {
                  link: "existing" as const,
                  user_id: Number(author.user.id),
                }
              : { link: defaultLink },
          }
        : {}),
    },
    resolver: zodResolver(schema),
  });

  const linkMode = useWatch({ control, name: "user.link" });

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

  const userOptions = useMemo(() => {
    const options = [...users];

    if (
      author?.user &&
      !options.some((user) => user.id === author.user?.id)
    ) {
      options.unshift({
        id: author.user.id,
        name: author.user.name,
        email: author.user.email,
      });
    }

    return options;
  }, [users, author?.user]);

  const handleFormSubmit = async (
    data: CreateAuthorProfileDto | UpdateAuthorProfileDto,
  ) => {
    try {
      const payload = { ...data };

      if (payload.user?.link === "none" && !author?.user) {
        delete payload.user;
      }

      await onSubmit(payload);
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

      {allowUserLinking && (
        <Controller
          name="user.link"
          control={control}
          render={({ field, fieldState }) => (
            <Select
              isInvalid={fieldState.invalid}
              value={field.value ?? "none"}
              onChange={(value) => {
                const link = value as UserLinkMode;
                field.onChange(link);

                if (link === "none") {
                  setValue("user", { link: "none" });
                  return;
                }

                if (link === "existing") {
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
              <Label>User account</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {USER_LINK_OPTIONS.map((option) => (
                    <ListBox.Item
                      key={option.id}
                      id={option.id}
                      textValue={option.label}
                    >
                      {option.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Select>
          )}
        />
      )}

      {allowUserLinking && linkMode === "existing" && (
        <Controller
          name="user.user_id"
          control={control}
          render={({ field, fieldState }) => (
            <Select
              isInvalid={fieldState.invalid}
              value={field.value ? String(field.value) : ""}
              onChange={(value) => field.onChange(Number(value) || undefined)}
            >
              <Label>Existing user</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {userOptions.map((user) => (
                    <ListBox.Item
                      key={user.id}
                      id={user.id}
                      textValue={`${user.name} (${user.email})`}
                    >
                      {user.name} ({user.email})
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Select>
          )}
        />
      )}

      {allowUserLinking && linkMode === "new" && (
        <>
          <Controller
            name="user.name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField isInvalid={fieldState.invalid} isRequired>
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
              <TextField isInvalid={fieldState.invalid} isRequired>
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
              <TextField isInvalid={fieldState.invalid} isRequired>
                <Label>User password</Label>
                <Input {...field} type="password" />
                <FieldError>{fieldState.error?.message}</FieldError>
              </TextField>
            )}
          />
        </>
      )}
      {errors.root?.serverError && (
        <p className="sr-only">{errors.root.serverError.message}</p>
      )}
    </Form>
  );
}
