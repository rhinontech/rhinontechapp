"use client";
import { DashboardProvider } from "@/components/Common/DashboardProvider/DashboardProvider";
import { AdminDashboardShell } from "@/components/Admin/Common/AdminDashboardShell/AdminDashboardShell";
import { SideNavProvider, useSideNav } from "@/context/SideNavContext";
import { SidebarItem } from "@/components/Admin/Common/SidebarItem/SidebarItem";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import {
  BarChart2,
  Brain,
  MessageSquare,
  FlaskConical,
  Workflow,
  Zap,
} from "lucide-react";

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

  const sidebarItems = [
    {
      label: "Analyze",
      icon: <BarChart2 className="h-5 w-5" />,
      isCollapsible: true,
      isActive: false,
      children: [
        {
          label: "Performance",
          icon: <BarChart2 className="h-4 w-4" />,
          href: "#",
        },
        {
          label: "AI Insights",
          icon: <Brain className="h-4 w-4" />,
          href: "#",
        },
        {
          label: "Conversations",
          icon: <MessageSquare className="h-4 w-4" />,
          href: "#",
          externalLink: false,
        },
      ],
    },
    {
      label: "Train",
      icon: <Brain className="h-5 w-5" />,
      isCollapsible: true,
      children: [
        {
          label: "Content",
          icon: <BarChart2 className="h-4 w-4" />,
          href: "content",
        },
        {
          label: "Custom Answers",
          icon: <Brain className="h-4 w-4" />,
          href: "#",
          externalLink: false,
        },
      ],
    },
    { label: "Test", icon: <FlaskConical className="h-5 w-5" />, href: "#" },
  ];

  return (
    <div className="flex gap-2 w-full h-full">
      <aside
        className={`flex h-full flex-col bg-stone-100 rounded-l-xl transition-all duration-200 ease-in-out rounded-xl shadow-md ${
          isExpanded ? "w-[20%]" : "w-0"
        }`}
      >
        {isExpanded && (
          <div className="flex flex-col w-full flex-1">
            <div className="flex items-center w-full h-14 px-5 py-4 text-xl font-bold tracking-tight">
              Rhinon AI Agent
            </div>
            <div className="flex flex-col p-2 space-y-1">
              {sidebarItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  isCollapsible={item.isCollapsible}
                  isActive={item.isActive}
                >
                  {item.children?.map((child, childIndex) => (
                    <SidebarItem
                      key={childIndex}
                      icon={child.icon}
                      label={child.label}
                      href={child.href}
                      externalLink={child.externalLink}
                    />
                  ))}
                </SidebarItem>
              ))}
              <Separator className="my-2" />

              <div className="px-2 py-1">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4 mb-2"
                >
                  <Workflow className="h-5 w-5 mr-2" />
                  Workflows
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Simple Automations
                </Button>
              </div>
            </div>
          </div>
        )}
      </aside>
      <main className={`w-full`}>{children}</main>
    </div>
  );
}
