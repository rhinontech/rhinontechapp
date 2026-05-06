import { AdminDashboardShell } from "@/components/Admin/Common/AdminDashboardShell/AdminDashboardShell";

export default function SettingsPage() {
  return (
    <AdminDashboardShell>
      <div className="bg-white rounded-xl p-6 w-full h-full">
        <h1 className="text-base font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage roles and permissions</p>
      </div>
    </AdminDashboardShell>
  );
}
