import type React from "react";
import { TrialBanner } from "@/components/UIComponents/trial-banner";
import { Sidebar } from "@/components/Admin/Common/Sidebar/Sidebar";

export function AdminDashboardShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-stone-200">
      <Sidebar />
      <main className="flex flex-col m-2 gap-2 w-full">
        {/* <TrialBanner /> */}
        <div className={`flex-1 h-full ${className}`}>{children}</div>
      </main>
    </div>
  );
}
