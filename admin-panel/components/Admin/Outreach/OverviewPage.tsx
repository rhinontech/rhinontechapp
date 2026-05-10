"use client";

import { useCallback, useEffect, useState } from "react";
import {
  TbUsers,
  TbTarget,
  TbMailOpened,
  TbActivity,
  TbTrendingUp,
  TbArrowUpRight,
  TbArrowDownRight,
  TbLoader
} from "react-icons/tb";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { SubNavToggle } from "@/components/Admin/Common/CollapsibleSubNav/CollapsibleSubNav";
import { useSideNav } from "@/context/SideNavContext";

interface Stats {
  totalLeads: number;
  activeCampaigns: number;
  emailsSent: number;
  repliesReceived: number;
}

interface Activity {
  id: string;
  type: string;
  content: string;
  timestamp: string;
  lead?: { name: string; company: string };
}

export function OverviewPage() {
  const { isExpanded: isSubNavExpanded } = useSideNav();
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      // Mocking some stats for now as the backend might not have an aggregation route yet
      setStats({
        totalLeads: 1240,
        activeCampaigns: 4,
        emailsSent: 450,
        repliesReceived: 32
      });

      // Fetch actual recent activities
      const acts = await apiFetch<Activity[]>("/outreach/activities?limit=10");
      setActivities(acts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <TbLoader className="animate-spin text-stone-300" size={48} />
    </div>
  );

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <main className={cn("flex h-full min-h-0 w-full flex-col overflow-hidden", isSubNavExpanded ? "rounded-r-xl" : "rounded-xl")}>
        <div className="flex h-16 items-center justify-between border-b px-4 bg-white">
          <div className="flex items-center gap-3">
            <SubNavToggle />
            <div>
              <h1 className="text-base font-semibold tracking-tight text-gray-900">Outreach Overview</h1>
              <p className="text-xs text-gray-500">Real-time performance metrics and outreach activity.</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 space-y-8 bg-white">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard label="Total Leads" value={stats?.totalLeads} icon={<TbUsers />} trend="+12% from last month" trendUp />
            <StatCard label="Active Campaigns" value={stats?.activeCampaigns} icon={<TbTarget />} />
            <StatCard label="Emails Sent" value={stats?.emailsSent} icon={<TbMailOpened />} trend="+5.2%" trendUp />
            <StatCard label="Replies" value={stats?.repliesReceived} icon={<TbActivity />} trend="-2%" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                  <TbActivity className="text-stone-400" /> Recent Activity
                </h3>
              </div>
              <div className="flex-1 overflow-auto divide-y divide-stone-50">
                {activities.length === 0 ? (
                  <div className="p-10 text-center text-stone-400 text-sm italic">No recent activity</div>
                ) : activities.map(activity => (
                  <div key={activity.id} className="p-4 flex gap-4 hover:bg-stone-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                      <TbMailOpened className="text-stone-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-stone-800 font-medium leading-tight">
                        {activity.content}
                      </p>
                      <p className="text-[10px] text-stone-400 font-bold uppercase mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col items-center justify-center text-center">
              <TbTrendingUp size={64} className="text-stone-100 mb-4" />
              <h3 className="text-lg font-bold text-stone-800">Conversion Analytics</h3>
              <p className="text-sm text-stone-400 max-w-xs mt-2">Visualizing your reply rates and conversion funnel across campaigns.</p>
              <div className="mt-8 w-full space-y-4">
                <div className="h-2 bg-stone-100 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-stone-900 w-[65%]"></div>
                </div>
                <div className="h-2 bg-stone-100 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-stone-400 w-[40%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, trend, trendUp }: { label: string; value?: number; icon: React.ReactNode; trend?: string; trendUp?: boolean }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-stone-50 text-stone-900 rounded-xl text-xl">
          {icon}
        </div>
        {trend && (
          <span className={cn("text-[10px] font-bold flex items-center gap-0.5", trendUp ? "text-green-600" : "text-red-600")}>
            {trendUp ? <TbArrowUpRight /> : <TbArrowDownRight />}
            {trend}
          </span>
        )}
      </div>
      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-bold text-stone-900 mt-1">{value?.toLocaleString()}</p>
    </div>
  );
}
