import { BackButton } from "@/components/nav";
import BlogDetailsPageContent from "@/components/forms/blogs/blog-details-page-content";
import BlogDetailsToolbar from "@/components/forms/blogs/blog-details-toolbar";
import { AdminPage, AdminPageSection } from "@/components/ui/containers";
import { getServerBlogApi } from "@/lib/apis/server";

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, blogs] = await Promise.all([params, getServerBlogApi()]);
  const blog = await blogs.getBlog(slug);

  return (
    <AdminPage title="Blog Details">
      <BackButton href="/admin/blogs" data-slot="pre-action" />
      <AdminPageSection data-slot-container>
        <BlogDetailsToolbar blog={blog} />
        <BlogDetailsPageContent blog={blog} />
      </AdminPageSection>
    </AdminPage>
  );
}
