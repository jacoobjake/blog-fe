import { BlogList } from "@/components/datatables/blogs";
import { AdminPage } from "@/components/ui/containers";
import { getServerApi } from "@/lib/apis/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import AdminBlogsActions from "./blogs-actions";

const PAGE_SIZE = 10;

export default async function AdminBlogsPage() {
  const queryClient = new QueryClient();
  const api = await getServerApi();

  // Prefetch page 1
  await queryClient.prefetchQuery({
    queryKey: [
      "blogs",
      {
        pagination: { pageIndex: 0, pageSize: PAGE_SIZE },
        filters: {},
        sorting: [{ id: "updated_at", desc: true }],
        orderBy: [{ column: "updated_at", order: "DESC" }],
      },
    ],
    queryFn: () =>
      api.blogs.listBlogs({
        first: PAGE_SIZE,
        page: 1,
        orderBy: [{ column: "updated_at", order: "DESC" }],
      }),
  });

  return (
    <AdminPage title="Blogs">
      <AdminBlogsActions data-slot="extra-actions" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BlogList />
      </HydrationBoundary>
    </AdminPage>
  );
}
