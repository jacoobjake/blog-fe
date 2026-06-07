import PublicBlogList from "@/components/grids/blogs/public-blog-list";
import { getServerBlogApi } from "@/lib/apis/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const PAGE_SIZE = 12;

export default async function BlogIndex() {
  const queryClient = new QueryClient();
  const blogApi = await getServerBlogApi({ forwardCookies: false });

  await queryClient.prefetchQuery({
    queryKey: ["public-blogs", { pageIndex: 0, pageSize: PAGE_SIZE }],
    queryFn: () => blogApi.listPublicBlogs({ first: PAGE_SIZE, page: 1 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PublicBlogList />
    </HydrationBoundary>
  );
}
