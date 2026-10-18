"use client";

import DeleteBlogButton from "@/components/blogs/delete-blog-button";
import OpenEditorButton from "@/components/editors/open-editor-btn";
import { useAuth } from "@/hooks/auth";
import { Blog } from "@/lib/types";
import { canManageBlog } from "@/lib/utils/blog-permissions";
import { Button } from "@heroui/react";

const FORM_ID = "blog-details-form";

type BlogDetailsToolbarProps = {
  blog: Blog;
};

export default function BlogDetailsToolbar({ blog }: BlogDetailsToolbarProps) {
  const { user } = useAuth();
  const canManage = canManageBlog(user, blog);

  return (
    <>
      <OpenEditorButton
        slug={blog.slug}
        data-slot="extra-actions"
        data-slot-priority={5}
      />
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
    </>
  );
}

export { FORM_ID as BLOG_DETAILS_FORM_ID };
