"use client";

import { useAdminDashboardData } from "@/hooks/blogs";
import { getBlogAuthorName } from "@/lib/utils/blog-author";
import { dateToDatetimeString } from "@/lib/utils";
import { Button, Card, Chip, Skeleton } from "@heroui/react";
import Link from "next/link";
import OpenEditorButton from "@/components/editors/open-editor-btn";

function AdminDashboardSkeleton() {
  return (
    <div
      className="skeleton--shimmer space-y-6"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <div className="flex flex-wrap gap-3">
        <Skeleton animationType="none" className="h-10 w-28 rounded-full" />
        <Skeleton animationType="none" className="h-10 w-36 rounded-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="space-y-3 p-5">
            <Skeleton animationType="none" className="h-4 w-24 rounded-md" />
            <Skeleton animationType="none" className="h-9 w-16 rounded-md" />
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        <Skeleton animationType="none" className="h-6 w-40 rounded-md" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="w-full max-w-md space-y-2">
                  <Skeleton
                    animationType="none"
                    className="h-5 w-3/4 rounded-md"
                  />
                  <Skeleton
                    animationType="none"
                    className="h-4 w-1/2 rounded-md"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton
                    animationType="none"
                    className="h-7 w-20 rounded-full"
                  />
                  <Skeleton
                    animationType="none"
                    className="h-9 w-9 rounded-md"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardContent() {
  const { data, isLoading } = useAdminDashboardData();

  if (isLoading || !data) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/editor/blogs">
          <Button>New blog</Button>
        </Link>
        <Link href="/admin/blogs">
          <Button variant="secondary">Manage blogs</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted">Total blogs</p>
          <p className="mt-2 text-3xl font-bold">{data.total}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted">Published</p>
          <p className="mt-2 text-3xl font-bold text-success">{data.published}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted">Drafts</p>
          <p className="mt-2 text-3xl font-bold">{data.drafts}</p>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Recently updated</h2>
        {data.recent.length === 0 ? (
          <p className="text-muted">No blogs yet. Create your first post.</p>
        ) : (
          <div className="space-y-3">
            {data.recent.map((blog) => (
              <Card key={blog.slug} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <Link
                      href={`/admin/blogs/${blog.slug}`}
                      className="font-semibold hover:text-accent"
                    >
                      {blog.title}
                    </Link>
                    <p className="text-sm text-muted">
                      {getBlogAuthorName(blog)} · Updated{" "}
                      {dateToDatetimeString(new Date(blog.updated_at))}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip
                      variant="soft"
                      color={blog.is_published ? "success" : "default"}
                    >
                      {blog.is_published ? "Published" : "Draft"}
                    </Chip>
                    <OpenEditorButton slug={blog.slug} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
