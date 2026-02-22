"use client";

import { BlogList } from "@/components/datatables/blogs";
import { AdminPage } from "@/components/ui/containers";

export default function AdminBlogsPage() {
  return (
    <AdminPage title="Blogs">
      <BlogList />
    </AdminPage>
  );
}
