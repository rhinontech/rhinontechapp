"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SubNavToggle } from "@/components/Admin/Common/CollapsibleSubNav/CollapsibleSubNav";
import { useSideNav } from "@/context/SideNavContext";
import { TbCalendarCheck, TbClock, TbFilePencil, TbStopwatch } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

interface AttendanceStats {
  month: number;
  year: number;
  daysPresent: number;
  totalMinutes: number;
  today: {
    date: string;
    status: string;
    clockIn: string | null;
    clockOut: string | null;
    durationMinutes: number;
  };
}

function formatTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDuration(minutes: number): string {
  if (!minutes) return "0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function AttendanceOverview() {
  const { isExpanded: isSubNavExpanded } = useSideNav();
  const roleSlug = usePathname().split("/")[1];
  const [stats, setStats] = useState<AttendanceStats | null>(null);

  useEffect(() => {
    apiFetch<AttendanceStats>("/attendance/stats").then(setStats).catch(() => {});
  }, []);

  const statCards = [
    {
      label: "Clocked in",
      value: stats?.today.clockIn ? formatTime(stats.today.clockIn) : "Not yet",
      icon: <TbClock size={18} />,
    },
    {
      label: "Duration",
      value: stats?.today.durationMinutes ? formatDuration(stats.today.durationMinutes) : "0m",
      icon: <TbStopwatch size={18} />,
    },
    {
      label: "This month",
      value: stats ? `${stats.daysPresent} days` : "—",
      icon: <TbCalendarCheck size={18} />,
    },
    {
      label: "Requests",
      value: "0 pending",
      icon: <TbFilePencil size={18} />,
    },
  ];

  return (
    <div className={cn("flex flex-col h-full bg-stone-50 overflow-hidden", isSubNavExpanded ? "rounded-r-xl" : "rounded-xl")}>
      <div className="sticky top-0 z-10 flex items-center gap-4 h-16 px-5 border-b bg-stone-50">
        <SubNavToggle />
        <h1 className="text-base font-semibold tracking-tight">Attendance Overview</h1>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {statCards.map((item) => (
            <div key={item.label} className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {item.icon}
                {item.label}
              </div>
              <p className="mt-3 text-2xl font-semibold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>

        <section className="rounded-xl border border-gray-100 bg-stone-50 p-5">
          <p className="text-sm font-semibold text-gray-900">Today</p>
          {stats?.today.clockIn ? (
            <>
              <p className="mt-4 text-lg text-gray-600">You clocked in at {formatTime(stats.today.clockIn)}</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-600">DEFAULT SHIFT</span>
                <span className="text-sm text-gray-600">9:00 AM – 6:00 PM</span>
              </div>
            </>
          ) : (
            <p className="mt-4 text-lg text-gray-600">You haven't clocked in yet today.</p>
          )}
          <Link href={`/${roleSlug}/attendance/my`} className="mt-5 inline-block rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50">
            View monthly timesheet
          </Link>
        </section>
      </div>
    </div>
  );
}
