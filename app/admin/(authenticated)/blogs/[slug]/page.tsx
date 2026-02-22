import { BlogDetailsForm } from "@/components/forms/blogs";
import { BackButton } from "@/components/nav";
import { AdminPage } from "@/components/ui/containers";
import { getServerApi } from "@/lib/apis/server";

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, api] = await Promise.all([params, getServerApi()]);
  const blog = await api.blogs.getBlog(slug);

  return (
    <AdminPage title="Blog Details">
      <BackButton href="/admin/blogs" data-slot="pre-action" />
      <BlogDetailsForm type="edit" blog={blog} />
    </AdminPage>
  );
}
