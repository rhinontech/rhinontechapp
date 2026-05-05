import { AdminDashboardShell } from "@/components/Admin/Common/AdminDashboardShell/AdminDashboardShell";

export default function DashboardPage() {
  return (
    <AdminDashboardShell>
      <div className="bg-white rounded-xl shadow-sm p-6 w-full h-full">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of company operations</p>
      </div>
    </AdminDashboardShell>
  );
}
