"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { TbLayoutGrid, TbList, TbSearch } from "react-icons/tb";
import { cn } from "@/lib/utils";

interface Employee {
  id: string;
  fullName: string;
  companyEmail: string;
  department: string;
  status: "active" | "inactive";
  joiningDate: string;
  role: { name: string; slug: string };
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
      {status}
    </span>
  );
}

function EmployeeCard({ emp }: { emp: Employee }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
        {initials(emp.fullName)}
      </div>
      <div>
        <p className="font-semibold text-gray-900">{emp.fullName}</p>
        <p className="text-xs text-gray-500 mt-0.5">{emp.role?.name}</p>
        <p className="text-xs text-gray-400">{emp.department}</p>
      </div>
      <StatusBadge status={emp.status} />
      <p className="text-xs text-gray-400">{emp.companyEmail}</p>
    </div>
  );
}

function EmployeeRow({ emp }: { emp: Employee }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {initials(emp.fullName)}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{emp.fullName}</p>
            <p className="text-xs text-gray-400">{emp.companyEmail}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3 text-sm text-gray-600">{emp.role?.name}</td>
      <td className="px-5 py-3 text-sm text-gray-600">{emp.department}</td>
      <td className="px-5 py-3"><StatusBadge status={emp.status} /></td>
      <td className="px-5 py-3 text-sm text-gray-400">{new Date(emp.joiningDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
    </tr>
  );
}

export function PeopleDirectory() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"card" | "table">("card");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = Cookies.get("authToken");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/people`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setEmployees)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.fullName.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.role?.name.toLowerCase().includes(q) ||
      e.companyEmail.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">People</h1>
          <p className="text-sm text-gray-400">{employees.length} employees</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <TbSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-60"
            />
          </div>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setView("card")}
              className={cn("p-2 transition-colors", view === "card" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50")}
            >
              <TbLayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView("table")}
              className={cn("p-2 transition-colors", view === "table" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50")}
            >
              <TbList size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">No employees found.</div>
        ) : view === "card" ? (
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 lg:grid-cols-3">
            {filtered.map((emp) => <EmployeeCard key={emp.id} emp={emp} />)}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">Employee</th>
                  <th className="px-5 py-3 text-left">Role</th>
                  <th className="px-5 py-3 text-left">Department</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filtered.map((emp) => <EmployeeRow key={emp.id} emp={emp} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
