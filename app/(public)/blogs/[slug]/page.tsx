import { BlogContentViewer } from "@/components/editors/blog-editor";
import { getServerBlogApi } from "@/lib/apis/server";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateStaticParams() {
    const blogApi = await getServerBlogApi({ forwardCookies: false });
    let page = 1;
    let hasMorePages = true;
    const blogSlugs = new Set;

    while (hasMorePages) {
        const data = await blogApi.listPublicBlogSlugs({ first: 10000, page });

        data.data.forEach((blog) => blogSlugs.add(blog.slug));

        hasMorePages = data.paginatorInfo.hasMorePages ?? false;
        page++;
    }

    return Array.from(blogSlugs).map((slug) => ({
        slug
    }))
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const blogApi = await getServerBlogApi({ forwardCookies: false });

    const blog = await blogApi.getPublicBlog(slug);

    if (!blog) {
        notFound();
    }

    return <BlogContentViewer blog={blog} />
}