"use client";

import { useAdminDashboardData } from "@/hooks/blogs";
import { dateToDatetimeString } from "@/lib/utils";
import { Button, Card, Chip } from "@heroui/react";
import Link from "next/link";
import OpenEditorButton from "@/components/editors/open-editor-btn";

export default function AdminDashboardContent() {
  const { data, isLoading } = useAdminDashboardData();

  if (isLoading || !data) {
    return <p className="text-muted">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
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

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/editor/blogs">
          <Button>New blog</Button>
        </Link>
        <Link href="/admin/blogs">
          <Button variant="secondary">Manage blogs</Button>
        </Link>
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
                      {blog.author} · Updated{" "}
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
