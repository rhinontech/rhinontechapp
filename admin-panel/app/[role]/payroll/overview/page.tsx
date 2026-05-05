"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { AdminPayrollOverview } from "@/components/Admin/Payroll/AdminPayrollOverview";
import { PayrollOverview } from "@/components/Admin/Payroll/PayrollOverview";

export default function OverviewPage() {
  const [permissions, setPermissions] = useState<string[] | null>(null);

  useEffect(() => {
    try {
      setPermissions(JSON.parse(Cookies.get("permissions") ?? "[]"));
    } catch {
      setPermissions([]);
    }
  }, []);

  if (permissions === null) {
    return <div className="h-full bg-stone-50 rounded-r-xl" />;
  }

  const isAdmin = permissions.includes("payroll:write");
  return isAdmin ? <AdminPayrollOverview /> : <PayrollOverview />;
}
