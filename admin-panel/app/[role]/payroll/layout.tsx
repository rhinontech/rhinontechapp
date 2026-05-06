"use client";

import { AdminDashboardShell } from "@/components/Admin/Common/AdminDashboardShell/AdminDashboardShell";
import { CollapsibleSubNav } from "@/components/Admin/Common/CollapsibleSubNav/CollapsibleSubNav";
import { SideNavProvider } from "@/context/SideNavContext";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import {
  MdOutlineDashboard,
  MdOutlinePeopleAlt,
  MdOutlinePlayCircle,
} from "react-icons/md";
import {
  TbFileInvoice,
  TbArrowsTransferDown,
  TbGift,
  TbId,
} from "react-icons/tb";

function PayrollLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const roleSlug = pathname.split("/")[1];
  const base = `/${roleSlug}/payroll`;
  const [permissions, setPermissions] = useState<string[] | null>(null);

  useEffect(() => {
    try {
      setPermissions(JSON.parse(Cookies.get("permissions") ?? "[]"));
    } catch {
      setPermissions([]);
    }
  }, []);

  const isAdmin = permissions?.includes("payroll:write") ?? false;

  const adminItems = [
    { label: "Dashboard",    href: `${base}/overview`,   icon: <MdOutlineDashboard size={18} /> },
    { label: "Employees",    href: `${base}/employees`,  icon: <MdOutlinePeopleAlt size={18} /> },
    { label: "Run Payroll",  href: `${base}/run`,        icon: <MdOutlinePlayCircle size={18} /> },
    { label: "All Payslips", href: `${base}/payslips`,   icon: <TbFileInvoice size={18} /> },
  ];

  const employeeItems = [
    { label: "Overview",       href: `${base}/overview`,   icon: <MdOutlineDashboard size={18} /> },
    { label: "My Payslips",    href: `${base}/payslips`,   icon: <TbFileInvoice size={18} /> },
    { label: "Salary Details", href: `${base}/salary`,     icon: <TbId size={18} /> },
    { label: "Deductions",     href: `${base}/deductions`, icon: <TbArrowsTransferDown size={18} /> },
    { label: "Benefits",       href: `${base}/benefits`,   icon: <TbGift size={18} /> },
  ];

  const items = isAdmin ? adminItems : employeeItems;

  if (permissions === null) {
    return (
      <div className="flex w-full h-full">
        <aside className="w-[20%] min-w-[180px] bg-stone-100 rounded-l-xl border-r" />
        <main className="w-full h-full overflow-hidden bg-stone-50" />
      </div>
    );
  }

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
