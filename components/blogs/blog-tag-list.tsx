import type { Blog } from "@/lib/types";
import Link from "next/link";

export default function BlogTagList({
  tags,
  className = "",
}: {
  tags: { name: string }[];
  className?: string;
}) {
  if (!tags.length) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Link
          key={tag.name}
          href={`/blogs?tag=${encodeURIComponent(tag.name)}`}
          className="rounded-full bg-surface-secondary px-2.5 py-1 text-xs text-muted hover:text-accent transition-colors"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}
