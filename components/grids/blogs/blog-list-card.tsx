import { Blog } from "@/lib/types";
import { dateToDateString } from "@/lib/utils";
import Link from "next/link";


export default function BlogListCard({ blog }: { blog: Blog, height?: number }) {
    const createdAt = new Date(blog.created_at);

    return (
        <Link href={`/blogs/${blog.slug}`}>
            <div className="rounded-xl overflow-hidden shadow-accent/50 hover:shadow-lg transition bg-surface h-96 flex flex-col cursor-pointer">
                <img
                    src="images/jimmy_sticker.png"
                    loading="lazy"
                    className="h-48 w-full object-contain bg-accent/50"
                />
                <div className="p-4 flex flex-col justify-between grow">
                    <div>
                        <h2 className="text-3xl line-clamp-2 text-accent font-semibold">
                            {blog.title}
                        </h2>
                    </div>
                    <div>
                        <p>{blog.author}</p>
                        <p className="text-black/30 text-xs">{dateToDateString(createdAt)}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}