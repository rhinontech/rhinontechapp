"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SubNavToggle } from "@/components/Admin/Common/CollapsibleSubNav/CollapsibleSubNav";
import { useSideNav } from "@/context/SideNavContext";
import { TbCalendarCheck, TbChevronLeft, TbChevronRight, TbClock, TbFilePencil, TbStopwatch } from "react-icons/tb";
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

interface TeamAttendance {
  date: string;
  summary: {
    total: number;
    present: number;
    absent: number;
    active: number;
  };
  employees: {
    userId: string;
    fullName: string;
    companyEmail: string;
    department: string;
    roleName: string | null;
    roleSlug: string | null;
    attendance: {
      date: string;
      status: string;
      clockIn: string | null;
      clockOut: string | null;
      durationMinutes: number;
    };
  }[];
}

interface TeamMonthlyAttendance {
  month: number;
  year: number;
  days: string[];
  employees: {
    userId: string;
    fullName: string;
    companyEmail: string;
    department: string;
    roleName: string | null;
    roleSlug: string | null;
    presentDays: number;
    totalMinutes: number;
    attendance: {
      date: string;
      status: string;
      clockIn: string | null;
      clockOut: string | null;
      durationMinutes: number;
    }[];
  }[];
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
  const isTeamView = roleSlug === "superadmin" || roleSlug === "hr";
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [team, setTeam] = useState<TeamAttendance | null>(null);
  const [teamMonth, setTeamMonth] = useState<TeamMonthlyAttendance | null>(null);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  useEffect(() => {
    if (isTeamView) {
      apiFetch<TeamAttendance>("/attendance/team/today").then(setTeam).catch(() => {});
      apiFetch<TeamMonthlyAttendance>(`/attendance/team?month=${month}&year=${year}`).then(setTeamMonth).catch(() => {});
      return;
    }
    apiFetch<AttendanceStats>("/attendance/stats").then(setStats).catch(() => {});
  }, [isTeamView, month, year]);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear((value) => value - 1); }
    else setMonth((value) => value - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear((value) => value + 1); }
    else setMonth((value) => value + 1);
  };

  const monthLabel = new Date(year, month - 1, 1).toLocaleString("en-GB", { month: "long", year: "numeric" });

  const statCards = isTeamView ? [
    {
      label: "Active employees",
      value: team?.summary.total ?? "—",
      icon: <TbCalendarCheck size={18} />,
    },
    {
      label: "Present today",
      value: team?.summary.present ?? "—",
      icon: <TbClock size={18} />,
    },
    {
      label: "Currently working",
      value: team?.summary.active ?? "—",
      icon: <TbStopwatch size={18} />,
    },
    {
      label: "Requests",
      value: "0 pending",
      icon: <TbFilePencil size={18} />,
    },
  ] : [
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

        <section className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="text-sm font-semibold text-gray-900">{isTeamView ? "Team attendance today" : "Today"}</p>
          {isTeamView ? (
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-100">
              <div className="grid grid-cols-[1.4fr_1fr_0.75fr_0.75fr_0.75fr_0.75fr] bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <span>Employee</span>
                <span>Department</span>
                <span>Status</span>
                <span>Clock in</span>
                <span>Clock out</span>
                <span>Duration</span>
              </div>
              {(team?.employees ?? []).map((employee) => (
                <div key={employee.userId} className="grid grid-cols-[1.4fr_1fr_0.75fr_0.75fr_0.75fr_0.75fr] items-center border-t border-gray-100 px-4 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">{employee.fullName}</p>
                    <p className="truncate text-xs text-gray-400">{employee.companyEmail}</p>
                  </div>
                  <span className="text-gray-600">{employee.department}</span>
                  <span className={cn(
                    "w-fit rounded-md px-2 py-1 text-xs font-semibold capitalize",
                    employee.attendance.status === "present" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                  )}>
                    {employee.attendance.status}
                  </span>
                  <span className="text-gray-600">{formatTime(employee.attendance.clockIn)}</span>
                  <span className="text-gray-600">{formatTime(employee.attendance.clockOut)}</span>
                  <span className="text-gray-600">{formatDuration(employee.attendance.durationMinutes)}</span>
                </div>
              ))}
              {!team?.employees.length && (
                <div className="px-4 py-8 text-center text-sm text-gray-400">No active employees found.</div>
              )}
            </div>
          ) : stats?.today.clockIn ? (
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
          {!isTeamView && (
            <Link href={`/${roleSlug}/attendance/my`} className="mt-5 inline-block rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50">
              View monthly timesheet
            </Link>
          )}
        </section>

        {isTeamView && (
          <section className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-gray-900">Monthly attendance</p>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50">
                  <TbChevronLeft size={18} />
                </button>
                <span className="min-w-36 text-center text-sm font-medium text-gray-700">{monthLabel}</span>
                <button onClick={nextMonth} className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50">
                  <TbChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-auto rounded-lg border border-gray-100">
              <div
                className="grid min-w-[980px] bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-400"
                style={{ gridTemplateColumns: `220px repeat(${teamMonth?.days.length ?? 1}, 42px) 92px 92px` }}
              >
                <div className="sticky left-0 z-10 bg-gray-50 px-4 py-3">Employee</div>
                {(teamMonth?.days ?? []).map((day) => (
                  <div key={day} className="border-l border-gray-100 px-2 py-3 text-center">
                    {new Date(`${day}T00:00:00`).getDate()}
                  </div>
                ))}
                <div className="border-l border-gray-100 px-3 py-3 text-center">Present</div>
                <div className="border-l border-gray-100 px-3 py-3 text-center">Hours</div>
              </div>

              {(teamMonth?.employees ?? []).map((employee) => (
                <div
                  key={employee.userId}
                  className="grid min-w-[980px] border-t border-gray-100 text-sm"
                  style={{ gridTemplateColumns: `220px repeat(${teamMonth?.days.length ?? 1}, 42px) 92px 92px` }}
                >
                  <div className="sticky left-0 z-10 bg-white px-4 py-3">
                    <p className="truncate font-medium text-gray-900">{employee.fullName}</p>
                    <p className="truncate text-xs text-gray-400">{employee.department}</p>
                  </div>
                  {employee.attendance.map((day) => (
                    <div
                      key={`${employee.userId}-${day.date}`}
                      title={[
                        day.status,
                        `In: ${formatTime(day.clockIn)}`,
                        `Out: ${formatTime(day.clockOut)}`,
                        `Duration: ${formatDuration(day.durationMinutes)}`,
                      ].join(" | ")}
                      className="flex items-center justify-center border-l border-gray-100 px-2 py-3"
                    >
                      <span className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                        day.status === "present" && "bg-green-50 text-green-700",
                        day.status === "absent" && "bg-red-50 text-red-600",
                        day.status === "weekend" && "bg-gray-100 text-gray-400",
                        !["present", "absent", "weekend"].includes(day.status) && "bg-blue-50 text-blue-600"
                      )}>
                        {day.status === "present" ? "P" : day.status === "weekend" ? "W" : "A"}
                      </span>
                    </div>
                  ))}
                  <div className="border-l border-gray-100 px-3 py-3 text-center font-medium text-gray-700">{employee.presentDays}</div>
                  <div className="border-l border-gray-100 px-3 py-3 text-center text-gray-600">{formatDuration(employee.totalMinutes)}</div>
                </div>
              ))}

              {!teamMonth?.employees.length && (
                <div className="px-4 py-8 text-center text-sm text-gray-400">No monthly attendance found.</div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
