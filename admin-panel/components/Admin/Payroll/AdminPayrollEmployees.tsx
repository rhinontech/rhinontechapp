"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { SubNavToggle } from "@/components/Admin/Common/CollapsibleSubNav/CollapsibleSubNav";
import { TbPencil, TbCheck, TbX, TbSearch, TbLoader2 } from "react-icons/tb";

interface Employee {
  id: string;
  fullName: string;
  companyEmail: string;
  department: string;
  joiningDate: string;
  employmentType?: string;
  basicSalary?: number;
  hra?: number;
  ta?: number;
  medicalAllowance?: number;
  otherAllowances?: number;
  role?: { name: string };
}

interface SalaryForm {
  basicSalary: string;
  hra: string;
  ta: string;
  medicalAllowance: string;
  otherAllowances: string;
}

const INR = (v: number) => `₹${Number(v).toLocaleString("en-IN")}`;

function calcGross(f: SalaryForm) {
  return (
    Number(f.basicSalary || 0) +
    Number(f.hra || 0) +
    Number(f.ta || 0) +
    Number(f.medicalAllowance || 0) +
    Number(f.otherAllowances || 0)
  );
}

function calcNet(f: SalaryForm) {
  const gross = calcGross(f);
  const pf = Math.round(Number(f.basicSalary || 0) * 0.12);
  const pt = 200;
  return gross - pf - pt;
}

export function AdminPayrollEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SalaryForm>({ basicSalary: "", hra: "", ta: "", medicalAllowance: "", otherAllowances: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchEmployees = () => {
    const token = Cookies.get("authToken");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payroll/admin/employees`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setEmployees(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEmployees(); }, []);

  const startEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setError("");
    setForm({
      basicSalary:      String(emp.basicSalary  ?? ""),
      hra:              String(emp.hra           ?? ""),
      ta:               String(emp.ta            ?? ""),
      medicalAllowance: String(emp.medicalAllowance ?? ""),
      otherAllowances:  String(emp.otherAllowances  ?? ""),
    });
  };

  const cancelEdit = () => { setEditingId(null); setError(""); };

  const save = async (empId: string) => {
    if (!form.basicSalary || Number(form.basicSalary) <= 0) {
      setError("Basic salary is required");
      return;
    }
    setSaving(true);
    setError("");
    const token = Cookies.get("authToken");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payroll/admin/employees/${empId}/salary`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        basicSalary:      Number(form.basicSalary),
        hra:              Number(form.hra || 0),
        ta:               Number(form.ta || 0),
        medicalAllowance: Number(form.medicalAllowance || 0),
        otherAllowances:  Number(form.otherAllowances || 0),
      }),
    });
    setSaving(false);
    if (res.ok) {
      setEditingId(null);
      fetchEmployees();
    } else {
      const data = await res.json();
      setError(data.message ?? "Failed to save");
    }
  };

  const filtered = employees.filter(
    (e) =>
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      (e.role?.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-stone-50 rounded-r-xl overflow-hidden">
      <div className="sticky top-0 z-10 flex items-center gap-4 h-16 px-5 border-b bg-stone-50">
        <SubNavToggle />
        <h1 className="text-xl font-bold tracking-tight">Employee Salary Setup</h1>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* Search */}
        <div className="relative mb-5 max-w-sm">
          <TbSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, department or role…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-400">Loading employees…</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">No employees found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">Employee</th>
                  <th className="px-5 py-3 text-left">Role / Dept</th>
                  <th className="px-5 py-3 text-right">Basic (mo.)</th>
                  <th className="px-5 py-3 text-right">Gross (mo.)</th>
                  <th className="px-5 py-3 text-right">Net (mo.)</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((emp) => {
                  const isEditing = editingId === emp.id;
                  const hasSalary = emp.basicSalary && Number(emp.basicSalary) > 0;
                  const gross = hasSalary
                    ? (Number(emp.basicSalary) + Number(emp.hra ?? 0) + Number(emp.ta ?? 0) + Number(emp.medicalAllowance ?? 0) + Number(emp.otherAllowances ?? 0))
                    : null;
                  const net = hasSalary && gross
                    ? gross - Math.round(Number(emp.basicSalary) * 0.12) - 200
                    : null;

                  return (
                    <>
                      <tr key={emp.id} className={`hover:bg-gray-50 transition-colors ${isEditing ? "bg-blue-50/40" : ""}`}>
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900">{emp.fullName}</p>
                          <p className="text-xs text-gray-400">{emp.companyEmail}</p>
                        </td>
                        <td className="px-5 py-3">
                          <p className="text-gray-700">{emp.role?.name ?? "—"}</p>
                          <p className="text-xs text-gray-400">{emp.department}</p>
                        </td>
                        <td className="px-5 py-3 text-right font-medium">
                          {hasSalary ? INR(Number(emp.basicSalary)) : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-5 py-3 text-right">
                          {gross ? INR(gross) : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-5 py-3 text-right font-semibold">
                          {net ? INR(net) : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-5 py-3">
                          {hasSalary ? (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium">Set</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 font-medium">Not Set</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          {!isEditing && (
                            <button
                              onClick={() => startEdit(emp)}
                              className="flex items-center gap-1 text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
                            >
                              <TbPencil size={13} /> Edit
                            </button>
                          )}
                        </td>
                      </tr>

                      {/* Inline edit row */}
                      {isEditing && (
                        <tr key={`${emp.id}-edit`} className="bg-blue-50/60 border-t border-blue-100">
                          <td colSpan={7} className="px-5 py-4">
                            <div className="flex flex-wrap items-end gap-3">
                              {([
                                { key: "basicSalary",      label: "Basic Salary *" },
                                { key: "hra",              label: "HRA" },
                                { key: "ta",               label: "Transport (TA)" },
                                { key: "medicalAllowance", label: "Medical" },
                                { key: "otherAllowances",  label: "Other" },
                              ] as { key: keyof SalaryForm; label: string }[]).map(({ key, label }) => (
                                <div key={key} className="flex flex-col gap-1 min-w-[130px]">
                                  <label className="text-xs text-gray-500">{label}</label>
                                  <div className="relative">
                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                                    <input
                                      type="number"
                                      min={0}
                                      value={form[key]}
                                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                                      className="w-full pl-6 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>
                              ))}

                              {/* Preview */}
                              <div className="flex flex-col gap-1 ml-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-xs min-w-[160px]">
                                <span className="text-gray-500">Gross: <strong className="text-gray-900">{INR(calcGross(form))}</strong></span>
                                <span className="text-gray-500">PF (12%): <strong className="text-red-600">−{INR(Math.round(Number(form.basicSalary || 0) * 0.12))}</strong></span>
                                <span className="text-gray-500">PT: <strong className="text-red-600">−₹200</strong></span>
                                <span className="text-gray-500 border-t pt-1">Est. Net: <strong className="text-green-700">{INR(calcNet(form))}</strong></span>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2 self-end">
                                <button
                                  onClick={() => save(emp.id)}
                                  disabled={saving}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                  {saving ? <TbLoader2 size={13} className="animate-spin" /> : <TbCheck size={13} />}
                                  Save
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50"
                                >
                                  <TbX size={13} /> Cancel
                                </button>
                              </div>
                            </div>
                            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
