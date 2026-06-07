import OpenEditorButton from "@/components/editors/open-editor-btn";
import { BlogDetailsForm } from "@/components/forms/blogs";
import { BackButton } from "@/components/nav";
import { AdminPage } from "@/components/ui/containers";
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
      <OpenEditorButton slug={slug} data-slot="extra-actions" />
      <BlogDetailsForm type="edit" blog={blog} />
    </AdminPage>
  );
}
