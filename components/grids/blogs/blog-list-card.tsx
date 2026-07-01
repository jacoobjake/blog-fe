import { Blog } from "@/lib/types";
import { dateToDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const FALLBACK_THUMBNAIL = "/images/jimmy_sticker.png";

export default function BlogListCard({
  blog,
}: {
  blog: Blog;
  height?: number;
}) {
  const createdAt = new Date(blog.created_at);
  const thumbnail =
    blog.hero_asset?.media?.thumbnail_200 ??
    blog.hero_asset?.media?.url ??
    FALLBACK_THUMBNAIL;

  return (
    <Link href={`/blogs/${blog.slug}`}>
      <div className="rounded-xl overflow-hidden shadow-accent/50 hover:shadow-lg transition bg-surface h-96 flex flex-col cursor-pointer">
        <div className="relative h-48 w-full bg-accent/50">
          <Image
            src={thumbnail}
            alt={blog.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
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
          </div>
          <div>
            <p>{blog.author}</p>
            <p className="text-black/30 text-xs">
              {dateToDateString(createdAt)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
