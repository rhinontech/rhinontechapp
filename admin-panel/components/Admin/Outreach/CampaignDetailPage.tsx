"use client";

import { useCallback, useEffect, useState } from "react";
import {
  TbTarget,
  TbLoader,
  TbArrowLeft,
  TbUsers,
  TbActivity,
  TbSettings,
  TbPlayerPlay,
  TbPlayerPause,
  TbTrash,
  TbChevronRight,
  TbRefresh,
  TbCheck,
  TbX,
  TbCalendar,
  TbLayoutSidebarFilled,
  TbLayoutSidebarRightFilled
} from "react-icons/tb";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SubNavToggle } from "@/components/Admin/Common/CollapsibleSubNav/CollapsibleSubNav";
import { useSideNav } from "@/context/SideNavContext";

interface Campaign {
  id: string;
  name: string;
  stage: "Draft" | "Active" | "Paused" | "Completed";
  leadsProcessed: number;
  leadsTotal: number;
  dailyLimit: number;
  startDate: string;
  objective: string;
  notes: string;
  template?: { name: string };
  leads?: any[];
  activities?: any[];
}

const STAGE_COLORS = {
  Draft: "bg-stone-100 text-stone-600 border-stone-200",
  Active: "bg-green-50 text-green-700 border-green-100",
  Paused: "bg-yellow-50 text-yellow-700 border-yellow-100",
  Completed: "bg-blue-50 text-blue-700 border-blue-100",
};

export function CampaignDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isExpanded: isSubNavExpanded, toggleSideNav } = useSideNav();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"leads" | "activity" | "settings">("leads");
  const [running, setRunning] = useState(false);
  const [runLogs, setRunLogs] = useState<string[] | null>(null);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(true);

  const fetchCampaign = useCallback(async () => {
    try {
      const [data, campaignLeads] = await Promise.all([
        apiFetch<Campaign>(`/campaigns/${id}`),
        apiFetch<any[]>(`/leads?campaignId=${id}`)
      ]);
      setCampaign(data);
      setLeads(campaignLeads);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  const handleBack = () => {
    const parentPath = pathname.split("/").slice(0, -1).join("/");
    router.push(`${parentPath}?id=${id}`);
  };

  const handleRunNow = async () => {
    setRunning(true);
    setRunLogs(null);
    try {
      const result = await apiFetch<any>("/campaigns/cron/run");
      setRunLogs(result.logs || ["Successfully triggered engine run."]);
      fetchCampaign();
    } catch (err: any) {
      alert("Execution failed: " + err.message);
    } finally {
      setRunning(false);
    }
  };

  const updateStage = async (stage: string) => {
    try {
      await apiFetch(`/campaigns/${id}`, {
        method: "PUT",
        body: JSON.stringify({ stage })
      });
      fetchCampaign();
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <TbLoader className="animate-spin text-stone-300" size={48} />
    </div>
  );

  if (!campaign) return (
    <div className="flex flex-col items-center justify-center h-full text-stone-400">
      <TbTarget size={64} className="mb-4 opacity-20" />
      <p>Campaign not found</p>
    </div>
  );

  return (
    <div className="flex h-full min-h-0 gap-2 overflow-hidden">
      <main className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl bg-stone-50 border">
        <div className="flex h-16 items-center justify-between border-b px-4 bg-white">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-stone-100 hover:text-gray-900 transition-colors">
              <TbArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-gray-900">{campaign.name}</h1>
              <p className="text-xs text-gray-500">Automated outreach campaign monitoring.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunNow}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-50"
            >
              {running ? <TbLoader className="animate-spin" size={14} /> : <TbPlayerPlay size={14} />}
              Run Now
            </button>
            {!isPreviewExpanded && (
              <button onClick={() => setIsPreviewExpanded(true)} className="rounded-lg p-2 text-gray-600 hover:bg-stone-100">
                <TbLayoutSidebarFilled size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Total Leads", value: campaign.leadsTotal, icon: <TbUsers />, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Processed", value: campaign.leadsProcessed, icon: <TbCheck />, color: "text-green-600", bg: "bg-green-50" },
              { label: "Remaining", value: campaign.leadsTotal - campaign.leadsProcessed, icon: <TbRefresh />, color: "text-stone-400", bg: "bg-stone-100/50" },
              { label: "Daily Limit", value: campaign.dailyLimit, icon: <TbSettings />, color: "text-stone-900", bg: "bg-stone-200/50" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center gap-3">
                <div className={cn("p-2 rounded-lg text-xl", stat.bg, stat.color)}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-lg font-bold text-stone-900 leading-none mt-1">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-stone-200 shadow-sm flex flex-col overflow-hidden flex-1">
            <div className="flex border-b border-stone-100 bg-stone-50/30">
              {[
                { id: "leads", label: "Enrolled Leads", icon: <TbUsers /> },
                { id: "activity", label: "Execution Log", icon: <TbActivity /> },
                { id: "settings", label: "Campaign Settings", icon: <TbSettings /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 text-xs font-bold transition-all border-b-2 -mb-px",
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-transparent text-stone-400 hover:text-stone-600"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-4">
              {activeTab === "leads" && (
                <div className="overflow-auto rounded-lg border border-stone-100">
                  <table className="w-full text-left">
                    <thead className="bg-stone-100/50 border-b border-stone-100">
                      <tr>
                        <th className="px-6 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Lead</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-right">Draft</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {leads.map(lead => (
                        <tr key={lead.id} className="hover:bg-stone-50 transition-colors text-sm">
                          <td className="px-6 py-3">
                            <p className="font-bold text-stone-900">{lead.name}</p>
                            <p className="text-[10px] text-stone-400 font-medium uppercase">{lead.company}</p>
                          </td>
                          <td className="px-6 py-3">
                            <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            {lead.aiDraft ? (
                              <span className="text-emerald-600 flex items-center justify-end gap-1 text-[10px] font-bold">
                                <TbCheck /> AI DRAFT READY
                              </span>
                            ) : (
                              <span className="text-stone-300 text-[10px] font-bold italic uppercase">Pending</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="space-y-4">
                  {runLogs ? (
                    <div className="bg-stone-900 text-stone-300 p-6 rounded-xl font-mono text-xs leading-relaxed shadow-inner border border-stone-800">
                      <div className="flex items-center justify-between mb-4 border-b border-stone-800 pb-2">
                        <span className="text-stone-500">Live Execution Log — {new Date().toLocaleTimeString()}</span>
                        <button onClick={() => setRunLogs(null)} className="hover:text-white"><TbX /></button>
                      </div>
                      {runLogs.map((log, i) => (
                        <div key={i} className="mb-1">{log}</div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center text-stone-400 border border-dashed border-stone-200 rounded-xl">
                      <TbActivity size={48} className="mx-auto mb-4 opacity-10" />
                      <p className="text-sm">Click "Run Now" to trigger the automated outreach cycle.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="max-w-xl space-y-6">
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Campaign Objective</p>
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 text-stone-700 text-sm leading-relaxed font-medium">
                      {campaign.objective || "No objective defined."}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Aside Panel */}
      <aside className={`flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-white transition-all duration-200 ease-in-out ${isPreviewExpanded ? "w-[30%]" : "w-0"}`}>
        {isPreviewExpanded && (
          <div className="flex h-full flex-1 flex-col overflow-hidden">
            <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-5">
              <p className="-mb-px flex self-stretch items-center border-b-2 border-blue-600 text-sm font-semibold text-gray-900">
                Summary
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsPreviewExpanded(false)} className="text-gray-600 hover:text-gray-900">
                  <TbLayoutSidebarRightFilled size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-5 space-y-6">
              <div className="space-y-4">
                <div className="rounded-xl border border-stone-100 p-4 bg-stone-50/50">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Current Stage</p>
                  <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-widest", STAGE_COLORS[campaign.stage])}>
                    {campaign.stage}
                  </span>
                </div>

                <div className="rounded-xl border border-stone-100 p-4 bg-stone-50/50">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Controls</p>
                  <div className="flex gap-2">
                    {campaign.stage === "Active" ? (
                      <button onClick={() => updateStage("Paused")} className="flex-1 bg-yellow-50 text-yellow-600 border border-yellow-200 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                        <TbPlayerPause /> Pause
                      </button>
                    ) : (
                      <button onClick={() => updateStage("Active")} className="flex-1 bg-green-50 text-green-600 border border-green-200 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                        <TbPlayerPlay /> Activate
                      </button>
                    )}
                    <button className="p-2 text-stone-400 hover:text-red-600 border border-stone-200 rounded-lg">
                      <TbTrash size={18} />
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-stone-100 p-4 bg-stone-50/50">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Details</p>
                  <div className="space-y-3 mt-3">
                    <DetailItem label="Daily Limit" value={`${campaign.dailyLimit} emails/day`} />
                    <DetailItem label="Start Date" value={new Date(campaign.startDate).toLocaleDateString()} />
                    <DetailItem label="Template" value={campaign.template?.name || "None"} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-bold text-stone-800">{value}</p>
    </div>
  );
}
