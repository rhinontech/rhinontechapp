"use client";
import { DashboardProvider } from "@/components/Common/DashboardProvider/DashboardProvider";
import { AdminDashboardShell } from "@/components/Admin/Common/AdminDashboardShell/AdminDashboardShell";
import { SideNavProvider, useSideNav } from "@/context/SideNavContext";
import { SidebarItem } from "@/components/Admin/Common/SidebarItem/SidebarItem";
import {
  BarChart2,
  Brain,
  MessageSquare,
  FlaskConical,
  Workflow,
  Zap,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function SettingsLayout({
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
  const pathname = usePathname();

  const sidebarItems = [
    {
      label: "Home",
      icon: <BarChart2 className="h-5 w-5" />,
      isCollapsible: false,
      href: "/admin/settings",
      isActive: pathname === "/admin/settings",
    },
    {
      label: "Channels",
      icon: <Brain className="h-5 w-5" />,
      isCollapsible: true,
      isExpanded: pathname.startsWith("/admin/settings/channels"),
      children: [
        {
          label: "Messengers",
          icon: <BarChart2 className="h-4 w-4" />,
          href: "/admin/settings/channels/messengers",
          externalLink: false,
          isActive: pathname === "/admin/settings/channels/messengers",
        },
      ],
    },
    {
      label: "Subscription",
      icon: <Brain className="h-5 w-5" />,
      isCollapsible: true,
      isExpanded: pathname.startsWith("/admin/settings/subscription"),
      children: [
        {
          label: "Billing",
          icon: <BarChart2 className="h-4 w-4" />,
          href: "/admin/settings/subscription/billings",
          externalLink: false,
          isActive: pathname === "/admin/settings/subscription/billings",
        },
      ],
    },
  ];

  return (
    <div className="flex w-full h-full gap-2">
      <aside
        className={`flex h-full flex-col bg-stone-100 rounded-xl transition-all duration-200 ease-in-out shadow-md ${
          isExpanded ? "w-[15%]" : "w-0"
        }`}
      >
        {isExpanded && (
          <div className="flex flex-col w-full flex-1">
            <div className="flex items-center w-full h-16 px-5 py-4 text-xl font-semibold tracking-tight">
              Settings
            </div>
            <div className="flex flex-col px-5 pb-4 space-y-1">
              {sidebarItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  isCollapsible={item.isCollapsible}
                  isActive={item.isActive}
                  isExpanded={item.isExpanded} // Pass expanded state
                  href={item.href}
                >
                  {item.children?.map((child, childIndex) => (
                    <SidebarItem
                      key={childIndex}
                      icon={child.icon}
                      label={child.label}
                      href={child.href}
                      externalLink={child.externalLink}
                      isActive={child.isActive} // Ensure child gets active state
                    />
                  ))}
                </SidebarItem>
              ))}
            </div>
          </div>
        )}
      </aside>
      <main className={`w-full h-full`}>{children}</main>
    </div>
  );
}
