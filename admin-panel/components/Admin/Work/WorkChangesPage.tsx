"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { SubNavToggle } from "@/components/Admin/Common/CollapsibleSubNav/CollapsibleSubNav";
import { useSideNav } from "@/context/SideNavContext";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { TbLayoutSidebarFilled, TbLayoutSidebarRightFilled, TbPlus } from "react-icons/tb";

type RequestType = "Bug" | "Change request";
type RequestStatus = "Open" | "In review" | "In progress" | "Done";
type RequestPriority = "Low" | "Medium" | "High";
type PanelMode = "view" | "create" | "edit";

interface ProjectOption {
  id: string;
  name: string;
}

interface EmployeeOption {
  id: string;
  fullName: string;
  companyEmail: string;
}

interface WorkRequest {
  id: string;
  title: string;
  description: string;
  type: RequestType;
  status: RequestStatus;
  priority: RequestPriority;
  reportedBy: string | null;
  projectId: string;
  project: {
    id: string;
    name: string;
    status: string;
  } | null;
}

const emptyForm = {
  title: "",
  description: "",
  type: "Bug" as RequestType,
  status: "Open" as RequestStatus,
  priority: "Medium" as RequestPriority,
  projectId: "",
  reportedBy: "",
};

export function WorkChangesPage() {
  const { isExpanded: isSubNavExpanded } = useSideNav();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [requests, setRequests] = useState<WorkRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<WorkRequest | null>(null);
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "All">("All");
  const [typeFilter, setTypeFilter] = useState<RequestType | "All">("All");
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(true);
  const [mode, setMode] = useState<PanelMode>("view");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [projectsData, requestsData, employeesData] = await Promise.all([
        apiFetch<ProjectOption[]>("/work/projects"),
        apiFetch<WorkRequest[]>("/work/requests"),
        apiFetch<EmployeeOption[]>("/people"),
      ]);
      setProjects(projectsData);
      setEmployees(employeesData.map((employee) => ({
        id: employee.id,
        fullName: employee.fullName,
        companyEmail: employee.companyEmail,
      })));
      setRequests(requestsData.map((item) => ({ ...item, projectId: item.project?.id ?? "" })));
      setSelectedRequest((current) => {
        if (!requestsData.length) return null;
        if (current) return requestsData.find((item) => item.id === current.id) ?? requestsData[0];
        return requestsData[0];
      });
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const visibleRequests = useMemo(() => (
    requests.filter((request) => {
      const matchesProject = projectFilter === "all" || request.project?.id === projectFilter;
      const matchesStatus = statusFilter === "All" || request.status === statusFilter;
      const matchesType = typeFilter === "All" || request.type === typeFilter;
      return matchesProject && matchesStatus && matchesType;
    })
  ), [projectFilter, requests, statusFilter, typeFilter]);

  const startCreate = () => {
    setForm({ ...emptyForm, projectId: projectFilter === "all" ? "" : projectFilter });
    setMode("create");
    setIsPreviewExpanded(true);
  };

  const startEdit = () => {
    if (!selectedRequest) return;
    setForm({
      title: selectedRequest.title,
      description: selectedRequest.description,
      type: selectedRequest.type,
      status: selectedRequest.status,
      priority: selectedRequest.priority,
      projectId: selectedRequest.project?.id ?? "",
      reportedBy: selectedRequest.reportedBy ?? "",
    });
    setMode("edit");
    setIsPreviewExpanded(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        projectId: form.projectId || undefined,
        reportedBy: form.reportedBy || undefined,
      };
      if (mode === "create") {
        await apiFetch("/work/requests", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else if (mode === "edit" && selectedRequest) {
        await apiFetch(`/work/requests/${selectedRequest.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }
      await fetchData();
      setMode("view");
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 gap-2 overflow-hidden">
      <main className={cn("flex h-full min-h-0 w-full flex-col overflow-hidden bg-stone-50", isSubNavExpanded ? "rounded-r-xl" : "rounded-xl")}>
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-3">
            <SubNavToggle />
            <div>
              <h1 className="text-base font-semibold tracking-tight text-gray-900">Changes & Bugs</h1>
              <p className="text-xs text-gray-500">Project-wise grid for client-reported issues and requested changes.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={startCreate} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-stone-100">
              Add item
              <TbPlus size={14} />
            </button>
            {(!isPreviewExpanded || (visibleRequests.length === 0 && mode !== "create")) && (
              <button onClick={() => setIsPreviewExpanded(true)} className="rounded-lg p-2 text-gray-600 hover:bg-stone-100">
                <TbLayoutSidebarFilled size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={projectFilter}
              onChange={(event) => setProjectFilter(event.target.value)}
              className="w-[220px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as RequestType | "All")}
              className="w-[180px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>Bug</option>
              <option>Change request</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as RequestStatus | "All")}
              className="w-[180px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>Open</option>
              <option>In review</option>
              <option>In progress</option>
              <option>Done</option>
            </select>
          </div>

          <div className="mt-8 overflow-auto rounded-xl border border-gray-100 bg-white">
            <div className="grid min-w-[980px] grid-cols-[1.4fr_1.2fr_0.9fr_0.9fr_0.9fr_1fr] border-b bg-stone-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <span>Title</span>
              <span>Project</span>
              <span>Type</span>
              <span>Status</span>
              <span>Priority</span>
              <span>Reported by</span>
            </div>
            {visibleRequests.map((request) => (
              <button
                key={request.id}
                onClick={() => {
                  setSelectedRequest(request);
                  setMode("view");
                  setIsPreviewExpanded(true);
                }}
                className={cn(
                  "grid min-w-[980px] grid-cols-[1.4fr_1.2fr_0.9fr_0.9fr_0.9fr_1fr] items-center border-b px-4 py-3 text-left text-sm hover:bg-stone-50",
                  selectedRequest?.id === request.id && "bg-blue-50 hover:bg-blue-50"
                )}
              >
                <span className="font-medium text-gray-900">{request.title}</span>
                <span className="truncate text-gray-600">{request.project?.name || "—"}</span>
                <span className="text-gray-600">{request.type}</span>
                <span className="text-gray-600">{request.status}</span>
                <span className="text-gray-600">{request.priority}</span>
                <span className="truncate text-gray-600">{request.reportedBy || "—"}</span>
              </button>
            ))}
            {!visibleRequests.length && (
              <div className="px-4 py-10 text-center text-sm text-gray-400">No change or bug items found.</div>
            )}
          </div>
        </div>
      </main>

      <aside className={`flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-white transition-all duration-200 ease-in-out ${isPreviewExpanded && (visibleRequests.length > 0 || mode === "create") ? "w-[36%]" : "w-0"}`}>
        {isPreviewExpanded && (visibleRequests.length > 0 || mode === "create") && (
          <div className="flex h-full flex-1 flex-col overflow-hidden">
            <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-5">
              <p className="-mb-px flex self-stretch items-center border-b-2 border-blue-600 text-sm font-semibold text-gray-900">
                {mode === "create" ? "Add item" : mode === "edit" ? "Edit item" : "Details"}
              </p>
              <div className="flex items-center gap-2">
                {mode === "view" && selectedRequest && (
                  <button onClick={startEdit} className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Edit
                  </button>
                )}
                <button onClick={() => setIsPreviewExpanded(false)} className="text-gray-600 hover:text-gray-900">
                  <TbLayoutSidebarRightFilled size={20} />
                </button>
              </div>
            </div>

            {mode === "view" ? (
              <div className="flex-1 overflow-auto p-5">
                {selectedRequest ? (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedRequest.title}</h2>
                      <p className="mt-2 text-sm text-gray-500">{selectedRequest.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <Detail label="Project" value={selectedRequest.project?.name || "—"} />
                      <Detail label="Reported by" value={selectedRequest.reportedBy || "—"} />
                      <Detail label="Type" value={selectedRequest.type} />
                      <Detail label="Status" value={selectedRequest.status} />
                      <Detail label="Priority" value={selectedRequest.priority} />
                      <Detail label="Project status" value={selectedRequest.project?.status || "—"} />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">Select an item.</div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-auto p-5">
                <FormInput label="Title" value={form.title} onChange={(value) => setForm((current) => ({ ...current, title: value }))} required />
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                  Description
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    className="min-h-32 rounded-lg border border-gray-200 px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Project
                    <select
                      value={form.projectId}
                      onChange={(event) => setForm((current) => ({ ...current, projectId: event.target.value }))}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Not linked</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Reported by
                    <select
                      value={form.reportedBy}
                      onChange={(event) => setForm((current) => ({ ...current, reportedBy: event.target.value }))}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select employee</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.fullName}>
                          {employee.fullName}
                        </option>
                      ))}
                    </select>
                  </label>
                  <SelectField label="Type" value={form.type} onChange={(value) => setForm((current) => ({ ...current, type: value as RequestType }))} options={["Bug", "Change request"]} />
                  <SelectField label="Status" value={form.status} onChange={(value) => setForm((current) => ({ ...current, status: value as RequestStatus }))} options={["Open", "In review", "In progress", "Done"]} />
                  <SelectField label="Priority" value={form.priority} onChange={(value) => setForm((current) => ({ ...current, priority: value as RequestPriority }))} options={["Low", "Medium", "High"]} />
                </div>
                <div className="flex items-center justify-end gap-3 border-t pt-4">
                  <button type="button" onClick={() => setMode("view")} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-100 p-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 font-medium text-gray-800">{value}</p>
    </div>
  );
}

function FormInput({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="rounded-lg border border-gray-200 px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
