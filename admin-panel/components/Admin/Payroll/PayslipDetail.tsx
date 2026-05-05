"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { TbArrowLeft, TbPrinter } from "react-icons/tb";

interface PayslipData {
  id: string;
  basicSalary: number;
  hra: number;
  ta: number;
  medicalAllowance: number;
  otherAllowances: number;
  grossPay: number;
  pfEmployee: number;
  pfEmployer: number;
  tds: number;
  professionalTax: number;
  otherDeductions: number;
  totalDeductions: number;
  netPay: number;
  paymentDate: string;
  status: string;
  payroll: { month: number; year: number };
  employee: { fullName: string; companyEmail: string; department: string; joiningDate: string; role: { name: string } };
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between py-2 px-4 ${highlight ? "bg-gray-50 font-semibold" : ""}`}>
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

export function PayslipDetail({ id }: { id: string }) {
  const [slip, setSlip] = useState<PayslipData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("authToken");
    let permissions: string[] = [];
    try {
      permissions = JSON.parse(Cookies.get("permissions") ?? "[]");
    } catch {
      permissions = [];
    }
    const endpoint = permissions.includes("payroll:write")
      ? `/payroll/admin/payslips/${id}`
      : `/payroll/me/payslips/${id}`;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then(setSlip)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex-1 p-6 flex items-center justify-center text-gray-400 text-sm">Loading...</div>;
  if (!slip) return <div className="flex-1 p-6 flex items-center justify-center text-gray-400 text-sm">Payslip not found.</div>;

  const fmt = (n: number) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <TbArrowLeft size={18} /> Back
        </button>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <TbPrinter size={16} /> Print / Download
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto print:shadow-none print:border-0">
        {/* Header */}
        <div className="px-6 py-5 border-b flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900">Payslip</p>
            <p className="text-sm text-gray-500">{MONTHS[slip.payroll.month - 1]} {slip.payroll.year}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${slip.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            {slip.status}
          </span>
        </div>

        {/* Employee info */}
        <div className="px-6 py-4 border-b grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Employee</p>
            <p className="font-medium">{slip.employee.fullName}</p>
            <p className="text-gray-500">{slip.employee.companyEmail}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Department / Role</p>
            <p className="font-medium">{slip.employee.department}</p>
            <p className="text-gray-500">{slip.employee.role?.name}</p>
          </div>
        </div>

        {/* Earnings */}
        <div className="px-6 pt-4 pb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Earnings</p>
          <div className="divide-y divide-gray-100 rounded-lg border border-gray-100 overflow-hidden">
            <Row label="Basic Salary" value={fmt(slip.basicSalary)} />
            <Row label="HRA" value={fmt(slip.hra)} />
            <Row label="Transport Allowance" value={fmt(slip.ta)} />
            <Row label="Medical Allowance" value={fmt(slip.medicalAllowance)} />
            {Number(slip.otherAllowances) > 0 && <Row label="Other Allowances" value={fmt(slip.otherAllowances)} />}
            <Row label="Gross Pay" value={fmt(slip.grossPay)} highlight />
          </div>
        </div>

        {/* Deductions */}
        <div className="px-6 pt-4 pb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Deductions</p>
          <div className="divide-y divide-gray-100 rounded-lg border border-gray-100 overflow-hidden">
            <Row label="PF (Employee 12%)" value={fmt(slip.pfEmployee)} />
            <Row label="TDS" value={fmt(slip.tds)} />
            <Row label="Professional Tax" value={fmt(slip.professionalTax)} />
            {Number(slip.otherDeductions) > 0 && <Row label="Other Deductions" value={fmt(slip.otherDeductions)} />}
            <Row label="Total Deductions" value={fmt(slip.totalDeductions)} highlight />
          </div>
        </div>

        {/* Net Pay */}
        <div className="px-6 py-5 mt-2 bg-gray-900 rounded-b-xl flex items-center justify-between">
          <p className="text-white font-semibold">Net Pay</p>
          <p className="text-white text-xl font-bold">{fmt(slip.netPay)}</p>
        </div>
      </div>
    </div>
  );
}
