"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { SubNavToggle } from "@/components/Admin/Common/CollapsibleSubNav/CollapsibleSubNav";
import {
  TbCalendar,
  TbHelpCircle,
  TbLayoutSidebarFilled,
  TbLayoutSidebarRightFilled,
  TbPlus,
  TbSearch,
  TbTrash,
} from "react-icons/tb";
import { cn } from "@/lib/utils";
import { useSideNav } from "@/context/SideNavContext";
import { apiFetch } from "@/lib/api";

type TaskScope = "My tasks" | "Team tasks" | "All tasks";
type TaskStatus = "Pending" | "In progress" | "Done";
type PanelMode = "view" | "create" | "edit";

interface ApiTask {
  id: string;
  title: string;
  description: string | null;
  assigneeId: string | null;
  team: string | null;
  dueDate: string | null;
  status: TaskStatus;
  assignee: { id: string; fullName: string; companyEmail: string } | null;
  creator: { id: string; fullName: string } | null;
  project: { id: string; name: string; status: string } | null;
}

interface ProjectOption {
  id: string;
  name: string;
}

interface EmployeeOption {
  id: string;
  fullName: string;
  companyEmail: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  team: string;
  dueDate: string;
  status: TaskStatus;
  projectId: string;
  projectName: string;
}

const SCOPE_PARAM: Record<TaskScope, string> = {
  "My tasks": "my",
  "Team tasks": "team",
  "All tasks": "all",
};

function ordinalDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const day = d.getDate();
  const month = d.toLocaleString("en-GB", { month: "long" });
  const year = d.getFullYear();
  const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
  return `${day}${suffix} ${month} ${year}`;
}

function mapApiTask(task: ApiTask): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? "",
    assigneeId: task.assignee?.id ?? "",
    assigneeName: task.assignee?.fullName ?? "Unassigned",
    team: task.team ?? "",
    dueDate: task.dueDate ? ordinalDate(task.dueDate) : "",
    status: task.status,
    projectId: task.project?.id ?? "",
    projectName: task.project?.name ?? "",
  };
}

function emptyForm() {
  return {
    title: "",
    description: "",
    team: "",
    dueDate: "",
    status: "Pending" as TaskStatus,
    projectId: "",
    assigneeId: "",
  };
}

export function TasksPage({ scope }: { scope: TaskScope }) {
  const { isExpanded: isSubNavExpanded } = useSideNav();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TaskStatus>("Pending");
  const [projectFilter, setProjectFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(true);
  const [mode, setMode] = useState<PanelMode>("view");
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const query = new URLSearchParams({ scope: SCOPE_PARAM[scope] });
      if (projectFilter !== "all") query.set("projectId", projectFilter);
      const data = await apiFetch<ApiTask[]>(`/tasks?${query.toString()}`);
      const mapped = data.map(mapApiTask);
      setTasks(mapped);
      setSelectedTask((current) => {
        if (!mapped.length) return null;
        if (current) return mapped.find((task) => task.id === current.id) ?? mapped[0];
        return mapped[0];
      });
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [projectFilter, scope]);

  useEffect(() => {
    setLoading(true);
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    apiFetch<ProjectOption[]>("/work/projects").then(setProjects).catch(() => {});
    apiFetch<EmployeeOption[]>("/people")
      .then((data) => setEmployees(data.map((employee) => ({ id: employee.id, fullName: employee.fullName, companyEmail: employee.companyEmail }))))
      .catch(() => {});
  }, []);

  const visibleTasks = useMemo(() => {
    const query = search.toLowerCase();
    return tasks.filter((task) => {
      const statusMatches = task.status === statusFilter;
      const searchMatches =
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.assigneeName.toLowerCase().includes(query) ||
        task.projectName.toLowerCase().includes(query);
      return statusMatches && searchMatches;
    });
  }, [search, statusFilter, tasks]);

  const selectTask = (task: Task) => {
    setSelectedTask(task);
    setMode("view");
    setIsPreviewExpanded(true);
  };

  const startCreate = () => {
    setForm(emptyForm());
    setMode("create");
    setIsPreviewExpanded(true);
  };

  const startEdit = () => {
    if (!selectedTask) return;
    setForm({
      title: selectedTask.title,
      description: selectedTask.description,
      team: selectedTask.team,
      dueDate: "",
      status: selectedTask.status,
      projectId: selectedTask.projectId,
      assigneeId: selectedTask.assigneeId,
    });
    setMode("edit");
    setIsPreviewExpanded(true);
  };

  const saveTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        team: form.team,
        dueDate: form.dueDate || undefined,
        status: form.status,
        projectId: form.projectId || undefined,
        assigneeId: form.assigneeId || undefined,
      };

      if (mode === "create") {
        await apiFetch("/tasks", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else if (mode === "edit" && selectedTask) {
        await apiFetch(`/tasks/${selectedTask.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }

      await fetchTasks();
      setMode("view");
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
      setTasks((current) => current.filter((task) => task.id !== taskId));
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
        setIsPreviewExpanded(false);
      }
    } catch {
      // silently fail
    }
  };

  return (
    <div className="flex h-full min-h-0 gap-2 overflow-hidden">
      <main className={cn("flex h-full min-h-0 w-full flex-col overflow-hidden bg-stone-50", isSubNavExpanded ? "rounded-r-xl" : "rounded-xl")}>
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SubNavToggle />
            <h1 className="text-lg font-semibold tracking-tight">{scope}</h1>
            <TbHelpCircle size={16} className="text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={startCreate} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-stone-100">
              Add a task
              <TbPlus size={14} />
            </button>
            {(!isPreviewExpanded || (visibleTasks.length === 0 && mode !== "create")) && (
              <button onClick={() => setIsPreviewExpanded(true)} className="rounded-lg p-2 text-gray-600 hover:bg-stone-100">
                <TbLayoutSidebarFilled size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-[440px]">
              <TbSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title, project, or assignee"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as TaskStatus)}
              className="w-[170px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Pending</option>
              <option>In progress</option>
              <option>Done</option>
            </select>
            <select
              value={projectFilter}
              onChange={(event) => setProjectFilter(event.target.value)}
              className="w-[240px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All projects / clients</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-8 space-y-3">
            {loading ? (
              <div className="rounded-xl border border-gray-100 p-8 text-center text-sm text-gray-400">Loading tasks...</div>
            ) : visibleTasks.length === 0 ? (
              <div className="rounded-xl border border-gray-100 p-8 text-center text-sm text-gray-400">No tasks found.</div>
            ) : visibleTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => selectTask(task)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border border-gray-100 px-5 py-4 text-left hover:bg-gray-50",
                  selectedTask?.id === task.id && "bg-blue-50 hover:bg-blue-50"
                )}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-4">
                    <span className="h-5 w-5 rounded border border-gray-400" />
                    <span className="font-medium text-gray-900">{task.title}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 pl-9 text-xs text-gray-500">
                    <span>{task.projectName || "No project linked"}</span>
                    <span>{task.assigneeName}</span>
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-4 text-sm text-gray-500">
                  {task.dueDate && (
                    <span className="inline-flex items-center gap-1">
                      <TbCalendar size={16} />
                      {task.dueDate}
                    </span>
                  )}
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteTask(task.id);
                    }}
                    className="rounded p-1 hover:text-red-500"
                  >
                    <TbTrash size={18} />
                  </button>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      <aside className={`flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-white transition-all duration-200 ease-in-out ${isPreviewExpanded && (visibleTasks.length > 0 || mode === "create") ? "w-[38%]" : "w-0"}`}>
        {isPreviewExpanded && (visibleTasks.length > 0 || mode === "create") && (
          <div className="flex h-full flex-1 flex-col overflow-hidden">
            <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-5">
              <p className="-mb-px flex self-stretch items-center border-b-2 border-blue-600 text-sm font-semibold text-gray-900">
                {mode === "create" ? "Add Task" : mode === "edit" ? "Edit Task" : "Task Details"}
              </p>
              <div className="flex items-center gap-2">
                {mode === "view" && selectedTask && (
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
                {selectedTask ? (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedTask.title}</h2>
                      <p className="mt-2 text-sm text-gray-500">{selectedTask.description || "No description added."}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <Detail label="Assignee" value={selectedTask.assigneeName} />
                      <Detail label="Team" value={selectedTask.team || "—"} />
                      <Detail label="Project / client" value={selectedTask.projectName || "—"} />
                      <Detail label="Due date" value={selectedTask.dueDate || "—"} />
                      <Detail label="Status" value={selectedTask.status} />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">Select a task.</div>
                )}
              </div>
            ) : (
              <form onSubmit={saveTask} className="flex-1 space-y-4 overflow-auto p-5">
                <FormInput label="Title" value={form.title} onChange={(value) => setForm((current) => ({ ...current, title: value }))} required />
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                  Description
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    className="min-h-28 rounded-lg border border-gray-200 px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Team" value={form.team} onChange={(value) => setForm((current) => ({ ...current, team: value }))} />
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Due date
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
                      className="rounded-lg border border-gray-200 px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Project / client
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
                  {employees.length > 0 && (
                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                      Assignee
                      <select
                        value={form.assigneeId}
                        onChange={(event) => setForm((current) => ({ ...current, assigneeId: event.target.value }))}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Assign to me</option>
                        {employees.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.fullName}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Status
                    <select
                      value={form.status}
                      onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as TaskStatus }))}
                      className="rounded-lg border border-gray-200 px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Pending</option>
                      <option>In progress</option>
                      <option>Done</option>
                    </select>
                  </label>
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
