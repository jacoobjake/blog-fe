import { BlogList } from "@/components/datatables/blogs";
import { AdminPage } from "@/components/ui/containers";
import AdminBlogsActions from "./blogs-actions";

export default function AdminBlogsPage() {
  return (
    <AdminPage title="Blogs">
      <AdminBlogsActions data-slot="extra-actions" />
      <BlogList />
    </AdminPage>
  );
}
