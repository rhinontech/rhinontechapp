"use client";

import { useCallback, useEffect, useState } from "react";
import {
  TbTemplate,
  TbPlus,
  TbTrash,
  TbEdit,
  TbLoader,
  TbX,
  TbCheck,
  TbInfoCircle,
  TbCircleCheck,
  TbBulb,
  TbLayoutSidebarFilled,
  TbLayoutSidebarRightFilled
} from "react-icons/tb";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { SubNavToggle } from "@/components/Admin/Common/CollapsibleSubNav/CollapsibleSubNav";
import { useSideNav } from "@/context/SideNavContext";

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  aiInstructions: string;
}

export function TemplatesPage() {
  const { isExpanded: isSubNavExpanded } = useSideNav();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [panelMode, setPanelMode] = useState<"view" | "create" | "edit">("view");
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    subject: "",
    body: "",
    aiInstructions: ""
  });

  const fetchTemplates = useCallback(async () => {
    try {
      const data = await apiFetch<Template[]>("/campaigns/templates");
      setTemplates(data);
      if (!selectedTemplate && data.length > 0) {
        setSelectedTemplate(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (panelMode === "create") {
        await apiFetch("/campaigns/templates", { method: "POST", body: JSON.stringify(form) });
      } else {
        await apiFetch(`/campaigns/templates/${selectedTemplate?.id}`, { method: "PUT", body: JSON.stringify(form) });
      }
      setPanelMode("view");
      fetchTemplates();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const startCreate = () => {
    setForm({ name: "", subject: "", body: "", aiInstructions: "" });
    setPanelMode("create");
    setIsPreviewExpanded(true);
  };

  const startEdit = () => {
    if (!selectedTemplate) return;
    setForm({
      name: selectedTemplate.name,
      subject: selectedTemplate.subject || "",
      body: selectedTemplate.body,
      aiInstructions: selectedTemplate.aiInstructions || ""
    });
    setPanelMode("edit");
    setIsPreviewExpanded(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await apiFetch(`/campaigns/templates/${id}`, { method: "DELETE" });
      if (selectedTemplate?.id === id) setSelectedTemplate(null);
      fetchTemplates();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <main className={cn("flex h-full min-h-0 w-full flex-col overflow-hidden bg-stone-50", isSubNavExpanded ? "rounded-r-xl" : "rounded-xl")}>
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-3">
            <SubNavToggle />
            <div>
              <h1 className="text-base font-semibold tracking-tight text-gray-900">Templates</h1>
              <p className="text-xs text-gray-500">Reusable message templates for outreach campaigns.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={startCreate} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-stone-100">
              New Template
              <TbPlus size={14} />
            </button>
            {(!isPreviewExpanded || (templates.length === 0 && panelMode !== "create")) && (
              <button onClick={() => setIsPreviewExpanded(true)} className="rounded-lg p-2 text-gray-600 hover:bg-stone-100">
                <TbLayoutSidebarFilled size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 gap-2">
            {loading ? (
              <div className="py-20 text-center text-sm text-gray-400">Loading...</div>
            ) : templates.length === 0 ? (
              <div className="py-20 text-center text-sm text-gray-400">No templates yet.</div>
            ) : templates.map(template => (
              <div
                key={template.id}
                onClick={() => { setSelectedTemplate(template); setPanelMode("view"); setIsPreviewExpanded(true); }}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white cursor-pointer hover:bg-stone-50 transition-colors group",
                  selectedTemplate?.id === template.id && "border-blue-500 ring-1 ring-blue-500 bg-blue-50/10"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-stone-50 rounded-lg text-stone-400">
                    <TbTemplate size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">{template.name}</h3>
                    <p className="text-xs text-stone-400 font-medium truncate max-w-[200px]">{template.subject || "No subject"}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(template.id); }}
                  className="p-1.5 text-stone-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <TbTrash size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Aside Panel */}
      <aside className={`flex min-h-0 h-full flex-col bg-white rounded-xl overflow-hidden transition-all duration-200 ease-in-out ${isPreviewExpanded && (templates.length > 0 || panelMode === "create") ? "w-[42%] ml-2" : "w-0"}`}>
        {isPreviewExpanded && (templates.length > 0 || panelMode === "create") && (
          <div className="flex h-full flex-1 flex-col overflow-hidden">
            <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-5">
              <p className="-mb-px flex self-stretch items-center border-b-2 border-blue-600 text-md font-medium tracking-tight text-black">
                {panelMode === "create" ? "New Template" : panelMode === "edit" ? "Edit Template" : "Details"}
              </p>
              <div className="flex items-center gap-2">
                {panelMode === "view" && selectedTemplate && (
                  <button onClick={startEdit} className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Edit
                  </button>
                )}
                <button onClick={() => setIsPreviewExpanded(false)} className="text-gray-600 hover:text-gray-900">
                  <TbLayoutSidebarRightFilled size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {panelMode === "view" && selectedTemplate ? (
                <div className="p-5 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900 mb-1">{selectedTemplate.name}</h2>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1">
                      <TbBulb size={12} /> {selectedTemplate.aiInstructions ? "AI Personalized" : "Standard Template"}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <DetailItem label="Subject Line" value={selectedTemplate.subject || "—"} />
                    <div className="rounded-lg border border-gray-100 p-3">
                      <p className="text-xs text-gray-400 mb-2">Message Body</p>
                      <p className="text-sm font-medium text-gray-900 leading-relaxed whitespace-pre-wrap">{selectedTemplate.body}</p>
                    </div>
                    {selectedTemplate.aiInstructions && (
                      <div className="rounded-xl border border-indigo-100 p-4 bg-indigo-50/30">
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                          <TbBulb /> AI Instructions
                        </p>
                        <p className="text-xs text-stone-600 italic leading-relaxed">{selectedTemplate.aiInstructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden p-5 space-y-4">
                  <FormInput label="Template Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required placeholder="e.g. Initial Outreach" />
                  <FormInput label="Subject Line" value={form.subject} onChange={v => setForm({ ...form, subject: v })} placeholder="Scaling {{company}}'s potential" />

                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Body
                    <textarea
                      required
                      value={form.body}
                      onChange={e => setForm({ ...form, body: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none h-64 text-sm font-medium"
                      placeholder="Hi {{lead.name}}..."
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-sm font-medium text-indigo-600">
                    <span className="flex items-center gap-1"><TbBulb /> AI Instructions</span>
                    <textarea
                      value={form.aiInstructions}
                      onChange={e => setForm({ ...form, aiInstructions: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-indigo-100 outline-none focus:ring-2 focus:ring-blue-500 bg-indigo-50/30 resize-none h-24 text-xs italic"
                      placeholder="Guide the AI on personalization..."
                    />
                  </label>

                  <div className="flex items-center justify-end gap-3 border-t pt-4 mt-auto">
                    <button type="button" onClick={() => setPanelMode("view")} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving} className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60 transition-colors">
                      {saving ? "Saving..." : panelMode === "create" ? "Save Template" : "Update Template"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-100 p-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}

function FormInput({ label, value, onChange, required, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
      {label}
      <input
        required={required}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
      />
    </label>
  );
}
