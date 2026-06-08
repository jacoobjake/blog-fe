"use client";

import { Label, TextField, cn } from "@heroui/react";
import {
  type ClipboardEvent,
  type KeyboardEvent,
  useState,
} from "react";

type TagsFieldProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  onBlur?: () => void;
  name?: string;
  isInvalid?: boolean;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  "aria-label"?: string;
};

function normalizeTag(raw: string): string {
  return raw.trim();
}

function mergeTags(existing: string[], incoming: string[]): string[] {
  const seen = new Set(existing.map((tag) => tag.toLowerCase()));
  const merged = [...existing];

  for (const raw of incoming) {
    const tag = normalizeTag(raw);
    if (!tag) continue;

    const key = tag.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    merged.push(tag);
  }

  return merged;
}

export default function TagsField({
  value,
  onChange,
  onBlur,
  name,
  isInvalid,
  label = "Tags",
  placeholder = "Type a tag, then press comma or Enter",
  errorMessage,
  "aria-label": ariaLabel,
}: TagsFieldProps) {
  const [inputValue, setInputValue] = useState("");
  const tags = value ?? [];

  const commitInput = (raw: string) => {
    const incoming = raw.split(",").map(normalizeTag).filter(Boolean);
    if (incoming.length === 0) return;

    onChange(mergeTags(tags, incoming));
    setInputValue("");
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
      return;
    }

    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      commitInput(inputValue);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (!text.includes(",")) return;

    e.preventDefault();
    commitInput([inputValue, text].filter(Boolean).join(","));
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      commitInput(inputValue);
    }
    onBlur?.();
  };

  return (
    <TextField isInvalid={isInvalid} aria-label={ariaLabel ?? label}>
      <Label>{label}</Label>
      <div
        className={cn(
          "flex flex-wrap items-center gap-1.5 min-h-10 px-2 py-1.5",
          "rounded-md border border-border bg-field-background",
          isInvalid && "border-danger",
        )}
      >
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center gap-1 rounded-full bg-surface-secondary px-2 py-0.5 text-sm"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              className="text-muted hover:text-foreground leading-none"
              onClick={() => removeTag(index)}
            >
              ×
            </button>
          </span>
        ))}
        <input
          name={name}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : undefined}
          className="flex-1 min-w-24 bg-transparent outline-none text-sm px-1 py-0.5"
        />
      </div>
      {errorMessage && (
        <span className="text-xs text-danger">{errorMessage}</span>
      )}
    </TextField>
  );
}
