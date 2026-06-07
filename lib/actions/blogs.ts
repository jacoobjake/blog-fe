"use server";

import { getServerBlogApi } from "@/lib/apis/server";
import type { CreateBlogDto, UpdateBlogDto } from "@/lib/schemas";
import { revalidatePublicBlogs } from "./revalidate-public-blogs";

export async function createBlogAction(data: CreateBlogDto) {
  const blogApi = await getServerBlogApi();
  const result = await blogApi.createBlog(data);

  await revalidatePublicBlogs({ slug: result.slug });

  return result;
}

export async function updateBlogAction(
  slug: string,
  data: Partial<UpdateBlogDto>,
) {
  const blogApi = await getServerBlogApi();
  const result = await blogApi.updateBlog(slug, data);

  await revalidatePublicBlogs({ slug: result.slug, previousSlug: slug });

  return result;
}
