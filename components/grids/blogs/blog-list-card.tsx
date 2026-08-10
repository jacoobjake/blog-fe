import { Blog } from "@/lib/types";
import { dateToDateString } from "@/lib/utils";
import Link from "next/link";
import { BlogCardThumbnail } from "./blog-card-thumbnail";
import BlogTagList from "@/components/blogs/blog-tag-list";

export default function BlogListCard({
  blog,
}: {
  blog: Blog;
  height?: number;
}) {
  const createdAt = new Date(blog.created_at);

  return (
    <article className="relative rounded-xl overflow-hidden shadow-accent/50 hover:shadow-lg transition bg-surface h-96 flex flex-col">
      <Link
        href={`/blogs/${blog.slug}`}
        className="absolute inset-0 z-0"
        aria-label={blog.title}
      />
      <div className="relative z-10 flex h-full flex-col pointer-events-none">
        <div className="relative h-48 w-full bg-accent/50">
          <BlogCardThumbnail
            media={blog.hero_asset?.media}
            alt={blog.title}
          />
        </div>
        <div className="p-4 flex flex-col justify-between grow">
          <div>
            <h2 className="text-3xl line-clamp-2 text-accent font-semibold">
              {blog.title}
            </h2>
            {blog.description && (
              <p className="text-sm text-muted line-clamp-2 mt-2">
                {blog.description}
              </p>
            )}
            <div className="pointer-events-auto relative z-10">
              <BlogTagList tags={blog.tags ?? []} className="mt-3" />
            </div>
          </div>
          <div className="mt-4">
            <p>{blog.author_profile.name}</p>
            <p className="text-black/30 text-xs dark:text-white/40">
              {dateToDateString(createdAt)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
