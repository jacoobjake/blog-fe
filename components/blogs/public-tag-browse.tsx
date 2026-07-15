"use client";

import { usePublicBlogTags } from "@/hooks/blogs";
import Link from "next/link";
import { Chip } from "@heroui/react";

export default function PublicTagBrowse() {
  const { data: tags = [], isLoading } = usePublicBlogTags();

  if (isLoading || tags.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 space-y-3">
      <h2 className="text-lg font-semibold">Browse by tag</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link key={tag.id} href={`/blogs?tag=${encodeURIComponent(tag.name)}`}>
            <Chip variant="soft" className="cursor-pointer">
              {tag.name}
            </Chip>
          </Link>
        ))}
      </div>
    </div>
  );
}
