"use client";

import { useCallback, useEffect, useState } from "react";
import {
  TbTarget,
  TbPlus,
  TbTargetArrow,
  TbLoader,
  TbCalendar,
  TbArrowRight,
  TbCheck,
  TbPlayerPlay,
  TbPlayerPause,
  TbCircleCheck,
  TbLayoutSidebarFilled,
  TbLayoutSidebarRightFilled,
  TbUsers,
  TbActivity,
  TbTrash,
  TbSearch,
  TbX,
} from "react-icons/tb";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { SubNavToggle } from "@/components/Admin/Common/CollapsibleSubNav/CollapsibleSubNav";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSideNav } from "@/context/SideNavContext";

type CampaignStage = "Draft" | "Active" | "Paused" | "Completed";

interface Campaign {
  id: string;
  name: string;
  stage: CampaignStage;
  leadsProcessed: number;
  leadsTotal: number;
  dailyLimit: number;
  startDate: string;
  runTime: string;
  scheduleDays: string[];
  objective?: string;
  templateId?: string;
  template?: { name: string };
}

interface Template {
  id: string;
  name: string;
}

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  status: string;
}

const STAGE_COLORS: Record<string, string> = {
  Draft: "bg-stone-100 text-stone-600 border-stone-200",
  Active: "bg-green-50 text-green-600 border-green-100",
  Paused: "bg-yellow-50 text-yellow-600 border-yellow-100",
  Completed: "bg-blue-50 text-blue-600 border-blue-100",
};

type CreateStep = "details" | "leads";

export function CampaignsPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isExpanded: isSubNavExpanded } = useSideNav();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [createStep, setCreateStep] = useState<CreateStep>("details");
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [saving, setSaving] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [createdCampaignId, setCreatedCampaignId] = useState<string | null>(null);

  // Lead enrollment state
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [leadSearch, setLeadSearch] = useState("");
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const [form, setForm] = useState({
    name: "",
    templateId: "",
    dailyLimit: 50,
    startDate: new Date().toISOString().split("T")[0],
    runTime: "09:00",
    scheduleDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] as string[],
    objective: "",
  });

  const fetchCampaigns = useCallback(async () => {
    try {
      const data = await apiFetch<Campaign[]>("/campaigns");
      setCampaigns(data);

      const idParam = searchParams.get("id");
      if (idParam) {
        const found = data.find((c) => c.id === idParam);
        if (found) setSelectedCampaign(found);
      } else {
        setSelectedCampaign((prev) => prev ?? (data[0] || null));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCampaigns();
    apiFetch<Template[]>("/campaigns/templates").then(setTemplates).catch(() => {});
  }, [fetchCampaigns]);

  const openAddPanel = () => {
    setShowAddPanel(true);
    setCreateStep("details");
    setSelectedCampaign(null);
    setIsPreviewExpanded(true);
    setSelectedLeadIds(new Set());
    setLeadSearch("");
    setCreatedCampaignId(null);
    setForm({
      name: "",
      templateId: "",
      dailyLimit: 50,
      startDate: new Date().toISOString().split("T")[0],
      runTime: "09:00",
      scheduleDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      objective: "",
    });
  };

  const handleCreateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const campaign = await apiFetch<Campaign>("/campaigns", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setCreatedCampaignId(campaign.id);
      // Load leads for enrollment step
      const leads = await apiFetch<Lead[]>("/leads");
      setAllLeads(leads);
      setCreateStep("leads");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEnrollAndFinish = async () => {
    if (!createdCampaignId) return;
    setEnrolling(true);
    try {
      if (selectedLeadIds.size > 0) {
        await apiFetch(`/campaigns/${createdCampaignId}/enroll`, {
          method: "POST",
          body: JSON.stringify({ leadIds: Array.from(selectedLeadIds) }),
        });
      }
      setShowAddPanel(false);
      setCreatedCampaignId(null);
      setSelectedLeadIds(new Set());
      fetchCampaigns();
    } catch (err: any) {
      alert("Enrollment failed: " + err.message);
    } finally {
      setEnrolling(false);
    }
  };

  const toggleLead = (id: string) => {
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleUpdateStage = async (id: string, stage: CampaignStage) => {
    try {
      await apiFetch(`/campaigns/${id}`, {
        method: "PUT",
        body: JSON.stringify({ stage }),
      });
      fetchCampaigns();
      if (selectedCampaign?.id === id) {
        setSelectedCampaign({ ...selectedCampaign, stage });
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm("Delete this campaign? Enrolled leads will be unenrolled.")) return;
    try {
      await apiFetch(`/campaigns/${id}`, { method: "DELETE" });
      if (selectedCampaign?.id === id) setSelectedCampaign(null);
      fetchCampaigns();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredLeads = allLeads.filter(
    (l) =>
      l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.company.toLowerCase().includes(leadSearch.toLowerCase())
  );

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <main
        className={cn(
          "flex h-full min-h-0 w-full flex-col overflow-hidden bg-stone-50",
          isSubNavExpanded ? "rounded-r-xl" : "rounded-xl"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-3">
            <SubNavToggle />
            <div>
              <h1 className="text-base font-semibold tracking-tight text-gray-900">Campaigns</h1>
              <p className="text-xs text-gray-500">Automate your outreach cycles with personalized templates.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openAddPanel}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-stone-100"
            >
              New Campaign
              <TbPlus size={14} />
            </button>
            {(!isPreviewExpanded || (campaigns.length === 0 && !showAddPanel && !selectedCampaign)) && (
              <button onClick={() => setIsPreviewExpanded(true)} className="rounded-lg p-2 text-gray-600 hover:bg-stone-100">
                <TbLayoutSidebarFilled size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="overflow-auto rounded-xl border border-gray-100 bg-white">
            <div className="grid min-w-[800px] w-full grid-cols-[minmax(250px,1.5fr)_minmax(120px,0.8fr)_minmax(150px,1fr)_80px] border-b bg-stone-100 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <span className="px-4 py-3">Campaign</span>
              <span className="px-4 py-3">Stage</span>
              <span className="px-4 py-3">Progress</span>
              <span className="px-4 py-3 text-right"></span>
            </div>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 border-b animate-pulse bg-stone-50/50"></div>
              ))
            ) : campaigns.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-gray-400">No campaigns yet.</div>
            ) : (
              campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  onClick={() => {
                    setSelectedCampaign(campaign);
                    setShowAddPanel(false);
                    setIsPreviewExpanded(true);
                  }}
                  className={cn(
                    "grid min-w-[800px] w-full cursor-pointer grid-cols-[minmax(250px,1.5fr)_minmax(120px,0.8fr)_minmax(150px,1fr)_80px] items-center border-b text-left text-sm hover:bg-stone-50 transition-colors group",
                    selectedCampaign?.id === campaign.id && "bg-blue-50/50"
                  )}
                >
                  <span className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-stone-900">{campaign.name}</span>
                      <span className="text-xs text-stone-500">
                        Starts {new Date(campaign.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </span>
                  <span className="px-4 py-3">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
                        STAGE_COLORS[campaign.stage]
                      )}
                    >
                      {campaign.stage}
                    </span>
                  </span>
                  <span className="px-4 py-3">
                    <div className="flex flex-col gap-1 min-w-[120px]">
                      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider">
                        <span className="text-stone-400">Sent</span>
                        <span className="text-stone-900">
                          {campaign.leadsProcessed} / {campaign.leadsTotal}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-stone-900 transition-all duration-1000"
                          style={{
                            width: `${(campaign.leadsProcessed / (campaign.leadsTotal || 1)) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </span>
                  <span className="px-4 py-3 flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCampaign(campaign.id);
                      }}
                      className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
                    >
                      <TbTrash size={15} />
                    </button>
                    <Link
                      href={`${pathname}/${campaign.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-stone-400 hover:text-stone-900"
                    >
                      <TbArrowRight size={18} />
                    </Link>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Aside Panel */}
      <aside
        className={`flex min-h-0 h-full flex-col bg-white rounded-xl overflow-hidden transition-all duration-200 ease-in-out ${
          isPreviewExpanded && (campaigns.length > 0 || showAddPanel || selectedCampaign)
            ? "w-[42%] ml-2"
            : "w-0"
        }`}
      >
        {isPreviewExpanded && (campaigns.length > 0 || showAddPanel || selectedCampaign) && (
          <div className="flex h-full flex-1 flex-col overflow-hidden">
            <div className="sticky top-0 z-10 flex h-16 items-stretch justify-between border-b bg-white px-5">
              <div className="flex items-center gap-3">
                <p className="-mb-px flex self-stretch items-center border-b-2 border-blue-600 text-md font-medium tracking-tight text-black">
                  {showAddPanel
                    ? createStep === "details"
                      ? "New Campaign"
                      : "Enroll Leads"
                    : "Campaign Status"}
                </p>
                {showAddPanel && createStep === "leads" && (
                  <span className="text-xs text-stone-400">
                    {selectedLeadIds.size} selected
                  </span>
                )}
              </div>
              <button onClick={() => setIsPreviewExpanded(false)} className="text-gray-600 hover:text-gray-900">
                <TbLayoutSidebarRightFilled size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              {showAddPanel ? (
                createStep === "details" ? (
                  <form onSubmit={handleCreateDetails} className="flex flex-col h-full p-5 space-y-4">
                    <FormInput
                      label="Campaign Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e })}
                      placeholder="e.g. Q4 Outreach"
                      required
                    />

                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                      Template
                      <select
                        required
                        value={form.templateId}
                        onChange={(e) => setForm({ ...form, templateId: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                      >
                        <option value="">Select a template...</option>
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="Daily Limit"
                        value={form.dailyLimit.toString()}
                        onChange={(e) => setForm({ ...form, dailyLimit: parseInt(e) || 50 })}
                        type="number"
                        required
                      />
                      <FormInput
                        label="Start Date"
                        value={form.startDate}
                        onChange={(e) => setForm({ ...form, startDate: e })}
                        type="date"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-gray-700">Run Time</span>
                      <div className="flex items-center gap-3">
                        <input
                          type="time"
                          value={form.runTime}
                          onChange={(e) => setForm({ ...form, runTime: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                        />
                        <span className="text-xs text-stone-400">Daily send time (24h)</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-gray-700">Active Days</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {DAYS.map((day) => {
                          const active = form.scheduleDays.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => setForm((f) => ({
                                ...f,
                                scheduleDays: active
                                  ? f.scheduleDays.filter((d) => d !== day)
                                  : [...f.scheduleDays, day],
                              }))}
                              className={cn(
                                "px-3 py-1 rounded-lg text-xs font-bold border transition-colors",
                                active
                                  ? "bg-stone-900 text-white border-stone-900"
                                  : "bg-white text-stone-400 border-stone-200 hover:border-stone-400"
                              )}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-stone-400">Cron engine will only send on selected days.</p>
                    </div>

                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                      Objective
                      <textarea
                        value={form.objective}
                        onChange={(e) => setForm({ ...form, objective: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none h-28 text-sm"
                        placeholder="Goal of this campaign..."
                      />
                    </label>

                    <div className="flex items-center justify-end gap-3 border-t pt-4 mt-auto">
                      <button
                        type="button"
                        onClick={() => setShowAddPanel(false)}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60 transition-colors"
                      >
                        {saving ? "Creating..." : "Next: Add Leads →"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col h-full p-5 gap-4">
                    <p className="text-xs text-stone-500">
                      Select leads to enroll in this campaign. You can also enroll leads later from the campaign detail page.
                    </p>

                    <div className="relative">
                      <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={15} />
                      <input
                        type="text"
                        placeholder="Search leads..."
                        value={leadSearch}
                        onChange={(e) => setLeadSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>

                    <div className="flex-1 overflow-auto rounded-lg border border-stone-100 divide-y divide-stone-50">
                      {filteredLeads.length === 0 ? (
                        <div className="py-8 text-center text-sm text-stone-400">No leads found</div>
                      ) : (
                        filteredLeads.map((lead) => (
                          <label
                            key={lead.id}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedLeadIds.has(lead.id)}
                              onChange={() => toggleLead(lead.id)}
                              className="rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-stone-900 truncate">{lead.name}</p>
                              <p className="text-xs text-stone-400 truncate">
                                {lead.company} · {lead.email}
                              </p>
                            </div>
                            <span className="ml-auto shrink-0 text-[10px] font-bold text-stone-400 uppercase">
                              {lead.status}
                            </span>
                          </label>
                        ))
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                      <button
                        type="button"
                        onClick={() => setCreateStep("details")}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={handleEnrollAndFinish}
                        disabled={enrolling}
                        className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60 transition-colors"
                      >
                        {enrolling
                          ? "Enrolling..."
                          : selectedLeadIds.size > 0
                          ? `Enroll ${selectedLeadIds.size} Lead${selectedLeadIds.size > 1 ? "s" : ""} & Finish`
                          : "Skip & Finish"}
                      </button>
                    </div>
                  </div>
                )
              ) : selectedCampaign ? (
                <div className="p-5 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900 mb-1">{selectedCampaign.name}</h2>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
                          STAGE_COLORS[selectedCampaign.stage]
                        )}
                      >
                        {selectedCampaign.stage}
                      </span>
                      <span className="text-xs text-stone-400 font-medium flex items-center gap-1">
                        <TbCalendar size={14} /> Starts{" "}
                        {new Date(selectedCampaign.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-gray-100 p-3">
                      <p className="text-xs text-gray-400 mb-1">Processed</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {selectedCampaign.leadsProcessed} / {selectedCampaign.leadsTotal}
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-100 p-3">
                      <p className="text-xs text-gray-400 mb-1">Daily Limit</p>
                      <p className="text-xl font-semibold text-gray-900">{selectedCampaign.dailyLimit}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-100 p-3">
                    <p className="text-xs text-gray-400 mb-1">Template</p>
                    <p className="font-semibold text-gray-900">
                      {selectedCampaign.template?.name || "No template assigned"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-100 p-3">
                    <p className="text-xs text-gray-400 mb-2">Schedule</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 flex-wrap">
                        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
                          <span key={d} className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold border",
                            selectedCampaign.scheduleDays?.includes(d)
                              ? "bg-stone-900 text-white border-stone-900"
                              : "bg-stone-50 text-stone-300 border-stone-100"
                          )}>{d}</span>
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-stone-900 ml-3 shrink-0">
                        {selectedCampaign.runTime || "09:00"}
                      </span>
                    </div>
                  </div>

                  {selectedCampaign.objective && (
                    <div className="rounded-lg border border-gray-100 p-3">
                      <p className="text-xs text-gray-400 mb-1">Objective</p>
                      <p className="text-sm font-medium text-gray-900 leading-relaxed">
                        {selectedCampaign.objective}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-3">
                    <p className="text-xs text-gray-400">Campaign Controls</p>
                    <div className="flex gap-2">
                      {selectedCampaign.stage === "Active" ? (
                        <button
                          onClick={() => handleUpdateStage(selectedCampaign.id, "Paused")}
                          className="flex-1 bg-yellow-50 text-yellow-600 border border-yellow-200 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-yellow-100"
                        >
                          <TbPlayerPause size={16} /> Pause Campaign
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStage(selectedCampaign.id, "Active")}
                          className="flex-1 bg-green-50 text-green-600 border border-green-200 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-green-100"
                        >
                          <TbPlayerPlay size={16} /> Activate Campaign
                        </button>
                      )}
                      <Link
                        href={`${pathname}/${selectedCampaign.id}`}
                        className="flex-1 bg-stone-900 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-stone-800"
                      >
                        <TbActivity size={16} /> View Logs
                      </Link>
                    </div>
                    <button
                      onClick={() => handleDeleteCampaign(selectedCampaign.id)}
                      className="w-full bg-red-50 text-red-600 border border-red-100 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-100"
                    >
                      <TbTrash size={16} /> Delete Campaign
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 space-y-6">
                  <div className="text-center py-20">
                    <TbTargetArrow size={48} className="mx-auto mb-4 text-stone-200" />
                    <h3 className="text-lg font-bold text-stone-900">Active Campaign Monitoring</h3>
                    <p className="text-sm text-stone-500 px-4 mt-2">
                      Select a campaign from the list to see detailed logs and run controls.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
      {label}
      <input
        required={required}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
      />
    </label>
  );
}
