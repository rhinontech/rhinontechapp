"use client";

import { useCallback, useEffect, useState } from "react";
import { SubNavToggle } from "@/components/Admin/Common/CollapsibleSubNav/CollapsibleSubNav";
import { TbChevronLeft, TbChevronRight, TbDownload, TbPlus, TbStopwatch } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { useSideNav } from "@/context/SideNavContext";
import { apiFetch } from "@/lib/api";

const attendanceTabs = ["Timesheet", "Regularization Requests", "Attendance Policies", "Other Policies", "Penalization Records", "Overtime Records"];

interface AttendanceDay {
  id: string | null;
  userId: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  status: "present" | "absent" | "weekend" | "holiday" | "leave";
  note: string | null;
  durationMinutes: number;
}

interface TodayStats {
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  status: string;
  durationMinutes: number;
}

function AttendanceStatus({ value }: { value: string }) {
  const isPresent = value === "P";
  return (
    <span className={cn(
      "inline-flex h-7 w-7 items-center justify-center rounded-full border text-sm font-semibold",
      isPresent ? "border-green-600 bg-green-100 text-green-700" : "border-red-500 bg-red-50 text-red-600"
    )}>
      {value}
    </span>
  );
}

function formatTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDuration(minutes: number): string {
  if (!minutes) return "0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function toHourFraction(iso: string | null): number | null {
  if (!iso) return null;
  const d = new Date(iso);
  return d.getHours() + d.getMinutes() / 60;
}

function ordinalLabel(iso: string, isToday: boolean): string {
  if (isToday) return "Today";
  const d = new Date(iso + "T00:00:00");
  const day = d.getDate();
  const month = d.toLocaleString("en-GB", { month: "long" });
  const year = d.getFullYear();
  const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
  return `${day}${suffix} ${month} ${year}`;
}

export function AttendancePage() {
  const { isExpanded: isSubNavExpanded } = useSideNav();
  const [activeTab, setActiveTab] = useState("Timesheet");
  const hourColumns = Array.from({ length: 24 }, (_, i) => i);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [days, setDays] = useState<AttendanceDay[]>([]);
  const [today, setToday] = useState<TodayStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [clockingOut, setClockingOut] = useState(false);

  const todayKey = now.toISOString().split("T")[0];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [monthDays, todayRecord] = await Promise.all([
        apiFetch<AttendanceDay[]>(`/attendance?month=${month}&year=${year}`),
        apiFetch<TodayStats>("/attendance/today"),
      ]);
      const reversed = [...monthDays].reverse();
      setDays(reversed);
      setToday(todayRecord);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleClockIn = async () => {
    try {
      await apiFetch("/attendance/clock-in", { method: "POST" });
      fetchData();
    } catch {
      // already clocked in or error
    }
  };

  const handleClockOut = async () => {
    setClockingOut(true);
    try {
      await apiFetch("/attendance/clock-out", { method: "POST" });
      fetchData();
    } catch {
      // silently fail
    } finally {
      setClockingOut(false);
    }
  };

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const monthLabel = new Date(year, month - 1, 1).toLocaleString("en-GB", { month: "long", year: "numeric" });

  return (
    <div className={cn("flex flex-col h-full bg-stone-50 overflow-hidden", isSubNavExpanded ? "rounded-r-xl" : "rounded-xl")}>
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <SubNavToggle />
        {attendanceTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn("rounded-lg px-3 py-1 text-sm font-medium text-gray-600", activeTab === tab && "bg-gray-100 text-gray-900")}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        <div className="border-b px-4 py-3">
          <h1 className="text-sm font-semibold tracking-tight">{activeTab}</h1>
        </div>

        {activeTab === "Timesheet" ? (
          <div className="mx-auto max-w-[1220px] p-6 space-y-6">
            <section className="rounded-xl border border-gray-100 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                  {today?.clockIn ? (
                    <>
                      <p className="mt-8 text-lg text-gray-500">You clocked in at {formatTime(today.clockIn)}</p>
                      <div className="mt-4 flex items-center gap-3">
                        <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-600">DEFAULT SHIFT</span>
                        <span className="text-gray-600">9:00 AM – 6:00 PM</span>
                      </div>
                      <p className="mt-3 text-gray-600">Duration: {formatDuration(today.durationMinutes)}</p>
                    </>
                  ) : (
                    <p className="mt-8 text-lg text-gray-500">You haven't clocked in yet today.</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">Add regularisation</button>
                  {today?.clockIn && !today?.clockOut ? (
                    <button
                      onClick={handleClockOut}
                      disabled={clockingOut}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
                    >
                      <TbStopwatch size={16} />
                      {clockingOut ? "Clocking out…" : "Clock out"}
                    </button>
                  ) : !today?.clockIn ? (
                    <button
                      onClick={handleClockIn}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-900 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                      Clock in
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400">Clocked out at {formatTime(today.clockOut)}</span>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex items-center justify-between px-2 pb-4">
                <div className="flex items-center gap-3">
                  <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100"><TbChevronLeft size={20} className="text-gray-500" /></button>
                  <h2 className="text-sm font-semibold text-gray-900">{monthLabel}</h2>
                  <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100"><TbChevronRight size={20} className="text-gray-500" /></button>
                </div>
                <button className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50">
                  <TbDownload size={18} />
                </button>
              </div>

              {loading ? (
                <div className="p-8 text-center text-sm text-gray-400">Loading…</div>
              ) : (
                <div className="grid overflow-hidden rounded-lg border border-gray-100" style={{ gridTemplateColumns: "150px repeat(24, minmax(38px, 1fr)) 72px 86px" }}>
                  <div className="bg-gray-50 p-3 text-sm text-gray-500">Date</div>
                  {hourColumns.map((h) => (
                    <div key={h} className="border-l bg-gray-50 p-3 text-center text-sm text-gray-500">
                      {h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`}
                    </div>
                  ))}
                  <div className="border-l bg-gray-50 p-3 text-center text-sm text-gray-500">Status</div>
                  <div className="border-l bg-gray-50 p-3 text-center text-sm text-gray-500">Time</div>

                  {days.map((day) => {
                    const isToday = day.date === todayKey;
                    const label = ordinalLabel(day.date, isToday);
                    const statusChar = day.status === "present" ? "P" : "A";
                    const note = day.status === "weekend" ? "Weekend" : day.status === "holiday" ? "Holiday" : day.note ?? undefined;
                    const clockInFrac = toHourFraction(day.clockIn);
                    const clockOutFrac = toHourFraction(day.clockOut) ?? (day.clockIn ? (new Date().getHours() + new Date().getMinutes() / 60) : null);

                    return (
                      <div key={day.date} className="contents">
                        <div className="border-t bg-gray-50 p-3 text-sm font-medium text-gray-800">{label}</div>
                        <div className="relative border-l border-t bg-white" style={{ gridColumn: "span 24" }}>
                          <div className="absolute inset-0 grid" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
                            {hourColumns.map((h) => <div key={h} className="border-l border-gray-100" />)}
                          </div>
                          {note && (
                            <div className="absolute left-0 right-0 top-1/2 z-10 mx-auto h-7 -translate-y-1/2 rounded-full border bg-gray-100 text-center text-sm leading-7 text-gray-600">
                              {note}
                            </div>
                          )}
                          {clockInFrac !== null && clockOutFrac !== null && (
                            <div
                              className={cn(
                                "absolute top-1/2 z-10 h-7 -translate-y-1/2 rounded-full border",
                                isToday ? "border-blue-500 bg-blue-100" : "border-green-400 bg-green-100"
                              )}
                              style={{
                                left: `${(clockInFrac / 24) * 100}%`,
                                width: `${((clockOutFrac - clockInFrac) / 24) * 100}%`,
                              }}
                            />
                          )}
                        </div>
                        <div className="border-l border-t p-3 text-center"><AttendanceStatus value={statusChar} /></div>
                        <div className="border-l border-t p-3 text-center text-sm text-gray-500">{formatDuration(day.durationMinutes)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            <div className="text-center">
              <TbPlus size={24} className="mx-auto mb-2" />
              {activeTab} will be connected next.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
