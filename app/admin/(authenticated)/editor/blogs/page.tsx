import BlogEditor from "@/components/editors/blog-editor";
import { getServerApi } from "@/lib/apis/server";
import { getCurrentUserAuthorProfile } from "@/lib/utils/default-author-profile";

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
  }

  if (!blog?.author_profile) {
    defaultAuthorProfile = await getCurrentUserAuthorProfile(api);
  }

  return (
    <BlogEditor blog={blog} defaultAuthorProfile={defaultAuthorProfile} />
  );
}
