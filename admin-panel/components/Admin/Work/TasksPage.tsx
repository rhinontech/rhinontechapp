"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { SubNavToggle } from "@/components/Admin/Common/CollapsibleSubNav/CollapsibleSubNav";
import { TbCalendar, TbDotsVertical, TbHelpCircle, TbLayoutSidebarFilled, TbLayoutSidebarRightFilled, TbPlus, TbSearch } from "react-icons/tb";
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
}

interface Task {
  id: string;
  title: string;
  description: string;
  assigneeName: string;
  team: string;
  dueDate: string;
  status: TaskStatus;
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

function mapApiTask(t: ApiTask): Task {
  return {
    id: t.id,
    title: t.title,
    description: t.description ?? "",
    assigneeName: t.assignee?.fullName ?? "Unassigned",
    team: t.team ?? "",
    dueDate: t.dueDate ? ordinalDate(t.dueDate) : "",
    status: t.status,
  };
}

function emptyForm(): { title: string; description: string; team: string; dueDate: string; status: TaskStatus } {
  return { title: "", description: "", team: "", dueDate: "", status: "Pending" };
}

export function TasksPage({ scope }: { scope: TaskScope }) {
  const { isExpanded: isSubNavExpanded } = useSideNav();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TaskStatus>("Pending");
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(true);
  const [mode, setMode] = useState<PanelMode>("view");
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await apiFetch<ApiTask[]>(`/tasks?scope=${SCOPE_PARAM[scope]}`);
      const mapped = data.map(mapApiTask);
      setTasks(mapped);
      if (mapped.length > 0 && !selectedTask) setSelectedTask(mapped[0]);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [scope]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setLoading(true);
    setSelectedTask(null);
    fetchTasks();
  }, [fetchTasks]);

  const visibleTasks = useMemo(() => {
    const q = search.toLowerCase();
    return tasks.filter((task) => {
      const statusMatches = task.status === statusFilter;
      const searchMatches = task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q) || task.assigneeName.toLowerCase().includes(q);
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
    });
    setMode("edit");
    setIsPreviewExpanded(true);
  };

  const saveTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (mode === "create") {
        await apiFetch("/tasks", {
          method: "POST",
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            team: form.team,
            dueDate: form.dueDate || undefined,
            status: form.status,
          }),
        });
      } else if (mode === "edit" && selectedTask) {
        await apiFetch(`/tasks/${selectedTask.id}`, {
          method: "PUT",
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            team: form.team,
            dueDate: form.dueDate || undefined,
            status: form.status,
          }),
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
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
        setIsPreviewExpanded(false);
      }
    } catch {
      // silently fail
    }
  };

  return (
    <div className="flex min-h-0 gap-2 h-full overflow-hidden">
      <main className={cn("flex min-h-0 flex-col h-full w-full bg-stone-50 overflow-hidden", isSubNavExpanded ? "rounded-r-xl" : "rounded-xl")}>
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
            {(!isPreviewExpanded || visibleTasks.length === 0) && (
              <button onClick={() => setIsPreviewExpanded(true)} className="p-2 text-gray-600 hover:bg-stone-100 rounded-lg">
                <TbLayoutSidebarFilled size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="flex items-center gap-3">
            <div className="relative w-[440px]">
              <TbSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title, description, or assignee"
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
          </div>

          <div className="mt-10 space-y-3">
            {loading ? (
              <div className="rounded-xl border border-gray-100 p-8 text-center text-sm text-gray-400">Loading tasks…</div>
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
                <div className="flex items-center gap-4">
                  <span className="h-5 w-5 rounded border border-gray-400" />
                  <span className="font-medium text-gray-900">{task.title}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {task.dueDate && (
                    <span className="inline-flex items-center gap-1">
                      <TbCalendar size={16} />
                      {task.dueDate}
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                    className="p-1 hover:text-red-500 rounded"
                  >
                    <TbDotsVertical size={18} />
                  </button>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      <aside className={`flex min-h-0 h-full flex-col bg-white rounded-xl overflow-hidden transition-all duration-200 ease-in-out ${isPreviewExpanded && visibleTasks.length > 0 ? "w-[38%]" : "w-0"}`}>
        {isPreviewExpanded && visibleTasks.length > 0 && (
          <div className="flex h-full flex-1 flex-col overflow-hidden">
            <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-5">
              <p className="flex self-stretch items-center border-b-2 border-blue-600 text-sm font-semibold text-gray-900 -mb-px">
                {mode === "create" ? "Add Task" : "Task Details"}
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
                      <p className="mt-2 text-sm text-gray-500">{selectedTask.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <Detail label="Assignee" value={selectedTask.assigneeName} />
                      <Detail label="Team" value={selectedTask.team || "—"} />
                      <Detail label="Due date" value={selectedTask.dueDate || "—"} />
                      <Detail label="Status" value={selectedTask.status} />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">Select a task.</div>
                )}
              </div>
            ) : (
              <form onSubmit={saveTask} className="flex-1 overflow-auto p-5 space-y-4">
                <FormInput label="Title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} required />
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                  Description
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="min-h-28 rounded-lg border border-gray-200 px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Team" value={form.team} onChange={(v) => setForm((f) => ({ ...f, team: v }))} />
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Due date
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                      className="rounded-lg border border-gray-200 px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Status
                    <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TaskStatus }))} className="rounded-lg border border-gray-200 px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-blue-500">
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
                    {saving ? "Saving…" : "Save"}
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
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="rounded-lg border border-gray-200 px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}
