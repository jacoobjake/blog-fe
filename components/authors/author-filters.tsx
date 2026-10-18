"use client";

import type { AuthorListFilters } from "@/lib/utils/author-filters";
import { toLikePattern } from "@/lib/utils/author-filters";
import { Button, Input, Label, TextField } from "@heroui/react";
import { useEffect, useState } from "react";

type AuthorFiltersProps = {
  filters: AuthorListFilters;
  onChange: (filters: AuthorListFilters) => void;
};

export default function AuthorFilters({
  filters,
  onChange,
}: AuthorFiltersProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(filters.name?.replace(/^%|%$/g, "") ?? "");
  }, [filters.name]);

  const applyFilters = () => {
    onChange({
      name: toLikePattern(name),
    });
  };

  const clearFilters = () => {
    setName("");
    onChange({});
  };

  const hasActiveFilters = Boolean(filters.name);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
      <TextField name="name" value={name} onChange={setName} className="w-full">
        <Label>Name</Label>
        <Input
          placeholder="Search by name"
          onKeyDown={(e) => {
            if (e.key === "Enter") applyFilters();
          }}
        />
      </TextField>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          size="sm"
          variant="ghost"
          isDisabled={!hasActiveFilters}
          onPress={clearFilters}
        >
          Clear
        </Button>
        <Button size="sm" onPress={applyFilters}>
          Apply filters
        </Button>
      </div>
    </div>
  );
}
