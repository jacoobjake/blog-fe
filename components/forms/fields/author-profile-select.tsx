"use client";

import { authorApi } from "@/lib/apis";
import type { AuthorProfile } from "@/lib/types";
import { Label, ListBox, Select } from "@heroui/react";
import { useEffect, useState } from "react";

type AuthorProfileSelectProps = {
  value?: number | null;
  onChange: (profile: AuthorProfile | null) => void;
  onBlur?: () => void;
  isInvalid?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
  "aria-label"?: string;
};

export default function AuthorProfileSelect({
  value,
  onChange,
  onBlur,
  isInvalid,
  errorMessage,
  isDisabled,
  "aria-label": ariaLabel = "Author profile",
}: AuthorProfileSelectProps) {
  const [profiles, setProfiles] = useState<AuthorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    authorApi
      .listAuthorProfiles({ first: 100 })
      .then((result) => {
        if (!cancelled) {
          setProfiles(result.data);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (value || profiles.length !== 1 || isDisabled) {
      return;
    }

    onChange(profiles[0] ?? null);
  }, [profiles, value, onChange, isDisabled]);

  const selectedKey = value ? String(value) : null;
  const selectedProfile =
    profiles.find((profile) => profile.id === String(value)) ?? null;

  return (
    <div className="space-y-1">
      <Select
        aria-label={ariaLabel}
        isInvalid={isInvalid}
        isDisabled={isDisabled || isLoading || profiles.length <= 1}
        selectedKey={selectedKey}
        onSelectionChange={(key) => {
          const profile =
            profiles.find((item) => item.id === String(key)) ?? null;
          onChange(profile);
          onBlur?.();
        }}
        placeholder={isLoading ? "Loading author profiles..." : "Select author"}
      >
        <Label>Author profile</Label>
        <Select.Trigger>
          <Select.Value>
            {selectedProfile
              ? selectedProfile.user
                ? `${selectedProfile.name} (${selectedProfile.user.email})`
                : selectedProfile.name
              : "Select author"}
          </Select.Value>
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {profiles.map((profile) => (
              <ListBox.Item
                key={profile.id}
                id={profile.id}
                textValue={profile.name}
              >
                <div className="flex flex-col">
                  <span>{profile.name}</span>
                  {profile.user?.email && (
                    <span className="text-xs text-muted">
                      {profile.user.email}
                    </span>
                  )}
                </div>
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
      {errorMessage && (
        <p className="text-xs text-danger">{errorMessage}</p>
      )}
    </div>
  );
}
