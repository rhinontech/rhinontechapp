import { AdminDashboardShell } from "@/components/Admin/Common/AdminDashboardShell/AdminDashboardShell";
import { ExploreMoreSection } from "@/components/UIComponents/explore-more-section";
import { GetStartedSection } from "@/components/UIComponents/get-started-section";

export default function AdminDashboard() {
  return (
    <AdminDashboardShell className="overflow-auto">
      <div className="flex flex-col gap-6 p-6 bg-white rounded-xl shadow-md overflow-auto">
        <div className="flex flex-col gap-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Get started with AI-first customer support
          </h1>
          <GetStartedSection />
          <ExploreMoreSection />
        </div>
      </div>
    </AdminDashboardShell>
  );
}
