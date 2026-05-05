"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { SubNavToggle } from "@/components/Admin/Common/CollapsibleSubNav/CollapsibleSubNav";
import { TbChevronDown, TbChevronRight } from "react-icons/tb";

interface UserProfile {
  id: string;
  fullName: string;
  personalEmail: string;
  companyEmail: string;
  department: string;
  status: string;
  joiningDate: string;
  employeeId?: string;
  pan?: string;
  employmentType?: string;
  compensationType?: string;
  workSchedule?: string;
  remotePosition?: boolean;
  workLocation?: string;
  annualCompensation?: number;
  paymentFrequency?: string;
  role?: { name: string; slug: string };
}

const TABS = ["Payroll Data", "Payslips", "Tax Data", "Reimbursements", "Flexi Benefits", "Loan Requests", "Loans"];

const LEFT_NAV = [
  "Basic Details",
  "Past Payroll",
  "Salary Structure",
  "Payment Information",
  "PF UAN",
  "ESIC",
  "LWF",
  "NPS",
  "PT",
];

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm text-gray-900 font-medium">{value ?? <span className="text-gray-300">—</span>}</p>
    </div>
  );
}

function LeftNavSection({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
        open ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <span>{label}</span>
      {open ? <TbChevronDown size={14} /> : <TbChevronRight size={14} />}
    </button>
  );
}

export function PayrollData() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Payroll Data");
  const [openSection, setOpenSection] = useState("Basic Details");

  useEffect(() => {
    const token = Cookies.get("authToken");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-full bg-stone-50 rounded-r-xl overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 h-16 px-5 border-b bg-stone-50">
        <SubNavToggle />
        <h1 className="text-xl font-bold tracking-tight">Payroll Data</h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b bg-white px-5 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab
                ? "border-blue-600 text-blue-600 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left nav */}
        <aside className="w-52 shrink-0 border-r bg-white overflow-y-auto">
          <div className="p-2 space-y-0.5">
            {LEFT_NAV.map((section) => (
              <LeftNavSection
                key={section}
                label={section}
                open={openSection === section}
                onToggle={() => setOpenSection(openSection === section ? "" : section)}
              />
            ))}
          </div>
        </aside>

        {/* Content area */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 xl:grid-cols-3 max-w-4xl">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : activeTab === "Payroll Data" && openSection === "Basic Details" ? (
            <BasicDetails profile={profile} />
          ) : activeTab === "Payroll Data" && openSection === "Salary Structure" ? (
            <SalaryStructure profile={profile} />
          ) : (
            <EmptySection label={activeTab !== "Payroll Data" ? activeTab : openSection} />
          )}
        </div>
      </div>
    </div>
  );
}

function BasicDetails({ profile }: { profile: UserProfile | null }) {
  const joinDate = profile?.joiningDate
    ? new Date(profile.joiningDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : undefined;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
          {profile?.fullName?.charAt(0) ?? "?"}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{profile?.fullName ?? "—"}</p>
          <p className="text-sm text-gray-400">{profile?.companyEmail ?? "—"}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 grid grid-cols-2 gap-x-8 gap-y-5 xl:grid-cols-3">
        <Field
          label="Status"
          value={
            profile?.status
              ? profile.status.charAt(0).toUpperCase() + profile.status.slice(1)
              : undefined
          }
        />
        <Field label="Employee ID" value={profile?.employeeId ?? `EMP-${profile?.id?.slice(0, 6).toUpperCase()}`} />
        <Field label="Legal Name" value={profile?.fullName} />
        <Field label="PAN" value={profile?.pan ?? "Not provided"} />
        <Field label="Role Title" value={profile?.role?.name} />
        <Field label="Employment Type" value={profile?.employmentType ?? "Full-Time"} />
        <Field label="Compensation Type" value={profile?.compensationType ?? "Salaried"} />
        <Field label="Work Schedule" value={profile?.workSchedule ?? "Standard (Mon–Fri)"} />
        <Field
          label="Remote Position"
          value={profile?.remotePosition != null ? (profile.remotePosition ? "Yes" : "No") : "No"}
        />
        <Field label="Joining Date" value={joinDate} />
        <Field label="Work Location" value={profile?.workLocation ?? profile?.department} />
        <Field
          label="Annual Compensation"
          value={
            profile?.annualCompensation
              ? `₹${Number(profile.annualCompensation).toLocaleString("en-IN")}`
              : "Not set"
          }
        />
        <Field label="Payment Frequency" value={profile?.paymentFrequency ?? "Monthly"} />
        <Field label="Department" value={profile?.department} />
        <Field label="Personal Email" value={profile?.personalEmail} />
      </div>
    </div>
  );
}

function SalaryStructure({ profile }: { profile: UserProfile | null }) {
  const annual = profile?.annualCompensation ? Number(profile.annualCompensation) : null;
  const monthly = annual ? Math.round(annual / 12) : null;
  const basic = monthly ? Math.round(monthly * 0.4) : null;
  const hra = monthly ? Math.round(monthly * 0.2) : null;
  const ta = monthly ? Math.round(monthly * 0.05) : null;
  const medical = monthly ? Math.round(monthly * 0.025) : null;
  const other = monthly && basic && hra && ta && medical ? monthly - basic - hra - ta - medical : null;

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b">
          <p className="font-semibold text-gray-900">Salary Structure</p>
          {monthly && (
            <p className="text-xs text-gray-400 mt-0.5">
              Based on ₹{Number(annual).toLocaleString("en-IN")} / year
            </p>
          )}
        </div>
        {!annual ? (
          <div className="p-8 text-center text-sm text-gray-400">Annual compensation not set.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Component</th>
                <th className="px-5 py-3 text-right">Monthly</th>
                <th className="px-5 py-3 text-right">Annual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { label: "Basic Salary", value: basic },
                { label: "HRA", value: hra },
                { label: "Transport (TA)", value: ta },
                { label: "Medical Allowance", value: medical },
                { label: "Other Allowances", value: other },
              ].map((row) => (
                <tr key={row.label} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-700">{row.label}</td>
                  <td className="px-5 py-3 text-right">₹{Number(row.value).toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3 text-right">₹{Number((row.value ?? 0) * 12).toLocaleString("en-IN")}</td>
                </tr>
              ))}
              <tr className="font-semibold bg-gray-50">
                <td className="px-5 py-3">Gross Monthly</td>
                <td className="px-5 py-3 text-right">₹{Number(monthly).toLocaleString("en-IN")}</td>
                <td className="px-5 py-3 text-right">₹{Number(annual).toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function EmptySection({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm">
      <p className="font-medium text-gray-500">{label}</p>
      <p className="text-xs mt-1 text-gray-400">No data available for this section.</p>
    </div>
  );
}
