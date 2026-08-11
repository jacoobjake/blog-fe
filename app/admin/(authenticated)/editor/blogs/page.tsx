import BlogEditor from "@/components/editors/blog-editor";
import { getServerApi } from "@/lib/apis/server";
import { canManageOwnAuthorProfile } from "@/lib/utils/author-permissions";
import { getErrorStatus } from "@/lib/utils/api-error";

export default async function BlogEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ slug: string | undefined }>;
}) {
  const { slug } = await searchParams;
  const api = await getServerApi();
  let blog;
  let defaultAuthorProfile = null;

  if (slug) {
    blog = await api.blogs.getBlog(slug);
  } else {
    const user = await api.auth.me();

    if (canManageOwnAuthorProfile(user)) {
      try {
        defaultAuthorProfile = await api.authors.getMyAuthorProfile();
      } catch (error) {
        if (getErrorStatus(error) !== 404) {
          throw error;
        }
      }
    }
  }

  return (
    <BlogEditor blog={blog} defaultAuthorProfile={defaultAuthorProfile} />
  );
}
