import BlogEditor from "@/components/editors/blog-editor";
import { getServerApi } from "@/lib/apis/server";

export default async function BlogEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ slug: string | undefined }>;
}) {
  const { slug } = await searchParams;
  const api = await getServerApi();
  let blog;

  if (slug) {
    blog = await api.blogs.getBlog(slug);
  }

  return <BlogEditor blog={blog} />;
}
