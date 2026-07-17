import PublicBlogList from "@/components/grids/blogs/public-blog-list";
import PublicBlogListSkeleton from "@/components/grids/blogs/public-blog-list-skeleton";
import { Suspense } from "react";

export default function BlogIndex() {
  return (
    <Suspense fallback={<PublicBlogListSkeleton />}>
      <PublicBlogList />
    </Suspense>
  );
}
