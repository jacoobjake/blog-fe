"use client";

import DeleteBlogButton from "@/components/blogs/delete-blog-button";
import { BlogDetailsForm } from "@/components/forms/blogs";
import OpenEditorButton from "@/components/editors/open-editor-btn";
import { useAuth } from "@/hooks/auth";
import { updateBlogAction } from "@/lib/actions/blogs";
import type { UpdateBlogMetadataDto } from "@/lib/schemas/blog";
import { Blog } from "@/lib/types";
import { canManageBlog } from "@/lib/utils/blog-permissions";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FORM_ID = "blog-details-form";

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
    <>
      <div data-slot-container>
        <OpenEditorButton slug={blog.slug} data-slot="extra-actions" />
        <Button
          type="submit"
          form={FORM_ID}
          data-slot="extra-actions"
          data-slot-priority={10}
          isDisabled={!canManage}
        >
          Save changes
        </Button>
        {canManage && (
          <div data-slot="extra-actions" data-slot-priority={20}>
            <DeleteBlogButton
              slug={blog.slug}
              title={blog.title}
              redirectTo="/admin/blogs"
            />
          </div>
        )}
      </div>
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
          formId={FORM_ID}
          onSubmit={handleSubmit}
          readOnly={!canManage}
        />
      </div>
    </>
  );
}
