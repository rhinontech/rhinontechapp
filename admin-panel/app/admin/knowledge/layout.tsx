"use client";
import { DashboardProvider } from "@/components/Common/DashboardProvider/DashboardProvider";
import { AdminDashboardShell } from "@/components/Admin/Common/AdminDashboardShell/AdminDashboardShell";
import { SideNavProvider, useSideNav } from "@/context/SideNavContext";

export default function KnowledgeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className="flex min-h-screen w-full flex-col"
      style={{
        minWidth: "1440px",
        overflowX: "auto",
      }}
    >
      <DashboardProvider>
        <SideNavProvider>
          <AdminDashboardShell>
            <LayoutContent>{children}</LayoutContent>
          </AdminDashboardShell>
        </SideNavProvider>
      </DashboardProvider>
    </main>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSideNav();

  return (
    <div className="flex gap-2 w-full h-full">
      <div
        className={`overflow-hidden flex w-full ${isExpanded ? "gap-2" : ""}`}
      >
        <aside
          className={`flex h-full flex-col bg-stone-100 rounded-l-xl transition-all duration-200 ease-in-out rounded-xl shadow-md ${
            isExpanded ? "w-[20%]" : "w-0"
          }`}
        >
          {isExpanded && (
            <div className="flex h-14 items-center justify-center border-b">
              data
            </div>
          )}
        </aside>
        <main className="flex flex-col bg-white rounded-xl shadow-md w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
