import { BackButton } from "@/components/nav";
import BlogDetailsPageContent from "@/components/forms/blogs/blog-details-page-content";
import BlogDetailsToolbar from "@/components/forms/blogs/blog-details-toolbar";
import { AdminPage, AdminPageSection } from "@/components/ui/containers";
import { getServerApi } from "@/lib/apis/server";
import { getCurrentUserAuthorProfile } from "@/lib/utils/default-author-profile";

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const api = await getServerApi();
  const blog = await api.blogs.getBlog(slug);
  const defaultAuthorProfile = blog.author_profile
    ? null
    : await getCurrentUserAuthorProfile(api);

  return (
    <AdminPage title="Blog Details">
      <BackButton href="/admin/blogs" data-slot="pre-action" />
      <AdminPageSection data-slot-container>
        <BlogDetailsToolbar blog={blog} />
        <BlogDetailsPageContent
          blog={blog}
          defaultAuthorProfileId={
            defaultAuthorProfile ? Number(defaultAuthorProfile.id) : undefined
          }
        />
      </AdminPageSection>
    </AdminPage>
  );
}
