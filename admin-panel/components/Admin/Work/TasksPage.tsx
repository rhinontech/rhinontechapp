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
  TbList,
  TbLayoutKanban,
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
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(true);
  const [mode, setMode] = useState<PanelMode>("view");
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

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
    apiFetch<ProjectOption[]>("/work/projects").then(setProjects).catch(() => { });
    apiFetch<EmployeeOption[]>("/people")
      .then((data) => setEmployees(data.map((employee) => ({ id: employee.id, fullName: employee.fullName, companyEmail: employee.companyEmail }))))
      .catch(() => { });
  }, []);

  const visibleTasks = useMemo(() => {
    const query = search.toLowerCase();
    return tasks.filter((task) => {
      const statusMatches = statusFilter === "all" || task.status === statusFilter;
      const assigneeMatches = assigneeFilter === "all" || task.assigneeId === assigneeFilter;
      const searchMatches =
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.assigneeName.toLowerCase().includes(query) ||
        task.projectName.toLowerCase().includes(query);
      return statusMatches && assigneeMatches && searchMatches;
    });
  }, [search, statusFilter, assigneeFilter, tasks]);

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
      dueDate: "", // Cannot map back ordinal date to input type date trivially, could store iso
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
        projectId: form.projectId || null,
        assigneeId: form.assigneeId || null,
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

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    setTasks((current) => current.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    try {
      await apiFetch(`/tasks/${taskId}`, { method: "PUT", body: JSON.stringify({ status: newStatus }) });
    } catch {
      fetchTasks();
    }
  };

  const handleAssigneeChange = async (taskId: string, newAssigneeId: string) => {
    const assignee = employees.find(e => e.id === newAssigneeId);
    setTasks((current) => current.map((t) => (t.id === taskId ? { ...t, assigneeId: newAssigneeId, assigneeName: assignee?.fullName || "Unassigned" } : t)));
    try {
      await apiFetch(`/tasks/${taskId}`, { method: "PUT", body: JSON.stringify({ assigneeId: newAssigneeId || null }) });
    } catch {
      fetchTasks();
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
  };

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    handleStatusChange(taskId, newStatus);
  };

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <main className={cn("flex h-full min-h-0 w-full flex-col overflow-hidden bg-stone-50", isSubNavExpanded ? "rounded-r-xl" : "rounded-xl")}>
        <div className="flex h-16 items-center justify-between border-b px-4 shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <SubNavToggle />
            <h1 className="text-lg font-semibold tracking-tight">{scope}</h1>
            <TbHelpCircle size={16} className="text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1 mr-2">
              <button
                onClick={() => setViewMode("list")}
                className={cn("px-3 py-1.5 rounded-md text-xs flex items-center gap-2 transition-colors", viewMode === "list" ? "bg-white font-medium text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900")}
              >
                <TbList size={16} /> List
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={cn("px-3 py-1.5 rounded-md text-xs flex items-center gap-2 transition-colors", viewMode === "kanban" ? "bg-white font-medium text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900")}
              >
                <TbLayoutKanban size={16} /> Kanban
              </button>
            </div>
            <button onClick={startCreate} className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-3 py-2 text-xs font-medium text-white hover:bg-stone-800 transition-colors">
              Add a task
              <TbPlus size={14} />
            </button>
            {(!isPreviewExpanded || (visibleTasks.length === 0 && mode !== "create")) && (
              <button onClick={() => setIsPreviewExpanded(true)} className="rounded-lg p-2 text-gray-600 hover:bg-stone-100 transition-colors">
                <TbLayoutSidebarFilled size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-[340px]">
              <TbSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm outline-none transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as TaskStatus | "all")}
              className="w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="In progress">In progress</option>
              <option value="Done">Done</option>
            </select>
            <select
              value={projectFilter}
              onChange={(event) => setProjectFilter(event.target.value)}
              className="w-[200px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <select
              value={assigneeFilter}
              onChange={(event) => setAssigneeFilter(event.target.value)}
              className="w-[180px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All assignees</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullName}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-400">Loading tasks...</div>
          ) : visibleTasks.length === 0 ? (
            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-400">No tasks found.</div>
          ) : viewMode === "list" ? (
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500">
                  <tr>
                    <th className="px-5 py-3.5">Task title</th>
                    <th className="px-5 py-3.5">Project</th>
                    <th className="px-5 py-3.5">Assignee</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 whitespace-nowrap">Due Date</th>
                    <th className="px-5 py-3.5 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visibleTasks.map((task) => (
                    <tr
                      key={task.id}
                      onClick={() => selectTask(task)}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-gray-50 group",
                        selectedTask?.id === task.id && "bg-blue-50/50"
                      )}
                    >
                      <td className="px-5 py-4 font-medium text-gray-900">{task.title}</td>
                      <td className="px-5 py-4 text-gray-500">{task.projectName || "—"}</td>
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={task.assigneeId}
                          onChange={(e) => handleAssigneeChange(task.id, e.target.value)}
                          className="rounded-md border border-transparent bg-transparent py-1.5 px-2 text-sm text-gray-700 outline-none hover:border-gray-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                        >
                          <option value="">Unassigned</option>
                          {employees.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.fullName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                          className={cn(
                            "appearance-none rounded-full border py-1.5 px-4 text-sm font-medium outline-none hover:opacity-80 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer text-center",
                            task.status === "Done"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : task.status === "In progress"
                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                : "bg-gray-50 text-gray-600 border-gray-100"
                          )}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In progress">In progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{task.dueDate || "—"}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                          }}
                          className="rounded-md p-1.5 text-gray-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                        >
                          <TbTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6 flex h-[calc(100%-80px)] gap-6 overflow-x-auto pb-4 items-start">
              {(["Pending", "In progress", "Done"] as TaskStatus[]).map((status) => {
                const colTasks = visibleTasks.filter((t) => t.status === status);
                return (
                  <div
                    key={status}
                    className="flex w-80 shrink-0 flex-col gap-3 rounded-2xl bg-gray-100/60 p-4"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, status)}
                  >
                    <div className="flex items-center justify-between px-1 mb-1">
                      <h3 className="text-[13px] font-bold tracking-wide text-gray-500 uppercase">{status}</h3>
                      <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">
                        {colTasks.length}
                      </span>
                    </div>
                    <div className="flex flex-col gap-3 min-h-[150px]">
                      {colTasks.map((task) => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onClick={() => selectTask(task)}
                          className={cn(
                            "group cursor-grab active:cursor-grabbing rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 hover:shadow-md",
                            selectedTask?.id === task.id && "ring-2 ring-blue-500 border-transparent"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-gray-900 text-sm leading-snug mb-3">
                              {task.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTask(task.id);
                              }}
                              className="rounded-md p-1 text-gray-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 shrink-0 -mt-1 -mr-1"
                            >
                              <TbTrash size={16} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                            <span className="truncate max-w-[120px] font-medium text-stone-500">
                              {task.projectName || "Internal"}
                            </span>
                            <div className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 pl-1 pr-2 py-0.5">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                                {task.assigneeName !== "Unassigned" ? task.assigneeName.charAt(0).toUpperCase() : "?"}
                              </span>
                              <span className="truncate max-w-[80px] font-medium text-gray-600">
                                {task.assigneeName !== "Unassigned" ? task.assigneeName.split(" ")[0] : "Unassigned"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <aside
        className={`flex h-full min-h-0 flex-col overflow-hidden rounded-xl transition-all duration-300 ease-in-out ${isPreviewExpanded && (visibleTasks.length > 0 || mode === "create") ? "w-[400px] shrink-0 ml-2" : "w-0"
          }`}
      >
        {isPreviewExpanded && (visibleTasks.length > 0 || mode === "create") && (
          <div className="flex h-full w-[400px] flex-col overflow-hidden">
            <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-5 shrink-0">
              <p className="-mb-px flex self-stretch items-center border-b-2 border-blue-600 text-sm font-semibold text-gray-900">
                {mode === "create" ? "Add Task" : mode === "edit" ? "Edit Task" : "Task Details"}
              </p>
              <div className="flex items-center gap-2">
                {mode === "view" && selectedTask && (
                  <button
                    onClick={startEdit}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </button>
                )}
                <button onClick={() => setIsPreviewExpanded(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                  <TbLayoutSidebarRightFilled size={20} />
                </button>
              </div>
            </div>

            {mode === "view" ? (
              <div className="flex-1 overflow-auto p-6">
                {selectedTask ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 leading-tight">{selectedTask.title}</h2>
                      <p className="mt-3 text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
                        {selectedTask.description || "No description provided."}
                      </p>
                    </div>

                    <div className="h-px w-full bg-gray-100"></div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm">
                      <Detail label="Assignee" value={selectedTask.assigneeName} />
                      <Detail label="Team" value={selectedTask.team || "—"} />
                      <Detail label="Project / client" value={selectedTask.projectName || "—"} />
                      <Detail label="Due date" value={selectedTask.dueDate || "—"} />
                      <Detail label="Status" value={selectedTask.status} />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">Select a task to view details.</div>
                )}
              </div>
            ) : (
              <form onSubmit={saveTask} className="flex h-full flex-col">
                <div className="flex-1 space-y-5 overflow-auto p-6 bg-stone-50">
                  <FormInput label="Task Title" value={form.title} onChange={(value) => setForm((current) => ({ ...current, title: value }))} required />
                  <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700">
                    Description
                    <textarea
                      value={form.description}
                      onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                      className="min-h-32 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-normal text-gray-900 outline-none transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="Add more details..."
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Team" value={form.team} onChange={(value) => setForm((current) => ({ ...current, team: value }))} />
                    <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700">
                      Due date
                      <input
                        type="date"
                        value={form.dueDate}
                        onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
                        className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal text-gray-900 outline-none transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700">
                      Project / client
                      <select
                        value={form.projectId}
                        onChange={(event) => setForm((current) => ({ ...current, projectId: event.target.value }))}
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-normal text-gray-900 outline-none transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Internal / Not linked</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    {employees.length > 0 && (
                      <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700">
                        Assignee
                        <select
                          value={form.assigneeId}
                          onChange={(event) => setForm((current) => ({ ...current, assigneeId: event.target.value }))}
                          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-normal text-gray-900 outline-none transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Unassigned</option>
                          {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                              {employee.fullName}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                    <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700 col-span-2">
                      Status
                      <select
                        value={form.status}
                        onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as TaskStatus }))}
                        className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal text-gray-900 outline-none transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option>Pending</option>
                        <option>In progress</option>
                        <option>Done</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 border-t bg-stone-50 p-5 shrink-0">
                  <button type="button" onClick={() => setMode("view")} className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 transition-colors">
                    {saving ? "Saving..." : "Save Task"}
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
    <div className="flex flex-col gap-1.5">
      <p className="text-[13px] font-semibold tracking-wide text-gray-500 uppercase">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

function FormInput({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal text-gray-900 outline-none transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}
