import PublicBlogList from "@/components/grids/blogs/public-blog-list";
import { getServerBlogApi } from "@/lib/apis/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

const PAGE_SIZE = 12;

export default async function BlogIndex() {
  const queryClient = new QueryClient();
  const blogApi = await getServerBlogApi({ forwardCookies: false });

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [
        "public-blogs",
        { pagination: { pageIndex: 0, pageSize: PAGE_SIZE }, filters: {} },
      ],
      queryFn: () => blogApi.listPublicBlogs({ first: PAGE_SIZE, page: 1 }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["public-blog-tags"],
      queryFn: () => blogApi.listPublicBlogTags(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p className="text-muted">Loading blogs...</p>}>
        <PublicBlogList />
      </Suspense>
    </HydrationBoundary>
  );
}
