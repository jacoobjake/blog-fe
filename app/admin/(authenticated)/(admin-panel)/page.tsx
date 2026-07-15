import AdminDashboardContent from "@/components/dashboard/admin-dashboard-content";
import { AdminPage } from "@/components/ui/containers";

export default function AdminDashboard() {
  return (
    <AdminPage title="Dashboard">
      <AdminDashboardContent />
    </AdminPage>
  );
}
