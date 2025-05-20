import type { Metadata } from "next";
import { DashboardProvider } from "@/components/Common/DashboardProvider/DashboardProvider";

export const metadata: Metadata = {
  title: "Rhinon Tech",
  // description:
  //   "uExcelerate is a leadership enablement platform for your personalised learning journey.",
};

export default function AdminLayout({
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
      <DashboardProvider>{children}</DashboardProvider>
    </main>
  );
}
