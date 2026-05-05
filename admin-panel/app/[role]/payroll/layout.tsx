"use client";

import { AdminDashboardShell } from "@/components/Admin/Common/AdminDashboardShell/AdminDashboardShell";
import { CollapsibleSubNav } from "@/components/Admin/Common/CollapsibleSubNav/CollapsibleSubNav";
import { SideNavProvider } from "@/context/SideNavContext";
import { usePathname } from "next/navigation";
import { MdOutlineDashboard } from "react-icons/md";
import { TbFileInvoice, TbArrowsTransferDown, TbGift, TbDatabase } from "react-icons/tb";

function PayrollLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const roleSlug = pathname.split("/")[1];
  const base = `/${roleSlug}/payroll`;

  const items = [
    { label: "Overview",     href: `${base}/overview`,   icon: <MdOutlineDashboard size={18} /> },
    { label: "Payroll Data", href: `${base}/data`,       icon: <TbDatabase size={18} /> },
    { label: "Payslips",     href: `${base}/payslips`,   icon: <TbFileInvoice size={18} /> },
    { label: "Deductions",   href: `${base}/deductions`, icon: <TbArrowsTransferDown size={18} /> },
    { label: "Benefits",     href: `${base}/benefits`,   icon: <TbGift size={18} /> },
  ];

  return (
    <div className="flex w-full h-full">
      <CollapsibleSubNav title="Payroll" items={items} />
      <main className="w-full h-full overflow-hidden">{children}</main>
    </div>
  );
}

export default function PayrollLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminDashboardShell>
      <SideNavProvider>
        <PayrollLayoutContent>{children}</PayrollLayoutContent>
      </SideNavProvider>
    </AdminDashboardShell>
  );
}
