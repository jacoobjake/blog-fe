"use client";

import { BlogDetailsForm } from "@/components/forms/blogs";
import { useAuth } from "@/hooks/auth";
import { updateBlogAction } from "@/lib/actions/blogs";
import type { UpdateBlogMetadataDto } from "@/lib/schemas/blog";
import { Blog } from "@/lib/types";
import { canManageBlog } from "@/lib/utils/blog-permissions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BLOG_DETAILS_FORM_ID } from "./blog-details-toolbar";

type BlogDetailsPageContentProps = {
  blog: Blog;
};

export default function BlogDetailsPageContent({
  blog,
}: BlogDetailsPageContentProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const canManage = canManageBlog(user, blog);

  const handleSubmit = async (data: UpdateBlogMetadataDto) => {
    const result = await updateBlogAction(blog.slug, data);
    setSuccessMessage("Blog updated successfully.");

    if (result.slug !== blog.slug) {
      router.replace(`/admin/blogs/${result.slug}`);
    }
  };

  return (
    <div className="space-y-4">
      {successMessage && (
        <p className="text-sm text-success">{successMessage}</p>
      )}
      <div className="text-sm text-muted space-y-1">
        {blog.created_by && <p>Created by {blog.created_by.name}</p>}
        {blog.updated_by && <p>Last updated by {blog.updated_by.name}</p>}
      </div>
      <BlogDetailsForm
        blog={blog}
        formId={BLOG_DETAILS_FORM_ID}
        onSubmit={handleSubmit}
        readOnly={!canManage}
      />
    </div>
  );
}
