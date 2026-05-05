import { AdminDashboardShell } from "@/components/Admin/Common/AdminDashboardShell/AdminDashboardShell";
import {
  Calendar,
  ClipboardList,
  Gift,
  Palmtree,
  PartyPopper,
  Stamp,
} from "lucide-react";

const birthdays = [
  { day: "13", name: "Vikas Yadav", initials: "VY", color: "bg-indigo-500" },
  { day: "30", name: "Pratyaksh Gupta", initials: "P", color: "bg-rose-500" },
];

const anniversaries = [
  { month: "May", day: "22", name: "Dushyanth", initials: "D", color: "bg-blue-500" },
  { month: "June", day: "1", name: "Kartik Khandelwal", initials: "KK", color: "bg-emerald-500" },
];

function HeaderIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-100 bg-gray-50 text-gray-600">
      {children}
    </span>
  );
}

function DashboardCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white ${className}`}>
      {children}
    </section>
  );
}

function CardTitle({
  icon,
  title,
  suffix,
}: {
  icon: React.ReactNode;
  title: string;
  suffix?: string;
}) {
  return (
    <div className="flex h-12 items-center gap-2.5 border-b border-gray-50 px-4">
      <HeaderIcon>{icon}</HeaderIcon>
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {suffix && <span className="text-xs text-gray-500">{suffix}</span>}
    </div>
  );
}

function DateBadge({ day }: { day: string }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-sm font-semibold text-gray-800">
      {day}
    </span>
  );
}

function PersonAvatar({
  initials,
  color,
}: {
  initials: string;
  color: string;
}) {
  return (
    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${color}`}>
      {initials}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <AdminDashboardShell>
      <div className="bg-stone-50 rounded-xl p-6 w-full h-full overflow-auto flex flex-col gap-2">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        {/* <p className="text-sm text-gray-500 mt-1">Overview of company operations</p> */}
        <div className="grid h-full grid-cols-12 grid-rows-[190px_250px_minmax(0,1fr)] gap-4">
          <DashboardCard className="col-span-6">
            <div className="flex h-12 items-center justify-between px-4">
              <div className="flex items-center gap-2.5">
                <HeaderIcon>
                  <Calendar className="h-4 w-4" />
                </HeaderIcon>
                <h1 className="text-base font-semibold text-gray-900">6 May 2026</h1>
              </div>
              <button className="rounded-lg border border-gray-900 px-4 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50">
                Clock in
              </button>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 pb-6 text-center text-gray-500">
              <Calendar className="h-8 w-8 text-gray-300" />
              <p className="text-sm">No upcoming shift and unscheduled clock-in is not allowed</p>
            </div>
          </DashboardCard>

          <DashboardCard className="col-span-6">
            <CardTitle icon={<Palmtree className="h-4 w-4" />} title="Upcoming holidays" />
            <div className="px-4 py-3">
              <p className="mb-3 text-sm font-medium text-gray-400">May</p>
              <div className="mb-4 flex items-center gap-3">
                <DateBadge day="27" />
                <p className="text-sm font-semibold text-gray-900">Bakrid</p>
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Floating Holiday</span>
              </div>
              <p className="text-sm font-medium text-gray-400">June</p>
            </div>
          </DashboardCard>

          <DashboardCard className="col-span-4">
            <CardTitle icon={<Calendar className="h-4 w-4" />} title="Upcoming leaves" />
            <div className="px-4 py-5 text-sm font-medium text-gray-600">No upcoming leaves this week!</div>
            <div className="mt-auto border-t border-gray-50 px-4 py-3">
              <button className="text-sm font-semibold text-orange-600 hover:text-orange-700">View all</button>
            </div>
          </DashboardCard>

          <DashboardCard className="col-span-4">
            <CardTitle icon={<Gift className="h-4 w-4" />} title="Birthdays" />
            <div className="px-4 py-4">
              <p className="mb-3 text-sm font-medium text-gray-400">May</p>
              <div className="space-y-3">
                {birthdays.map((person) => (
                  <div key={person.name} className="flex items-center gap-3">
                    <DateBadge day={person.day} />
                    <PersonAvatar initials={person.initials} color={person.color} />
                    <p className="text-sm font-semibold text-gray-900">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto border-t border-gray-50 px-4 py-3">
              <button className="text-sm font-semibold text-orange-600 hover:text-orange-700">View all</button>
            </div>
          </DashboardCard>

          <DashboardCard className="col-span-4">
            <CardTitle icon={<PartyPopper className="h-4 w-4" />} title="Anniversaries" />
            <div className="px-4 py-4">
              {anniversaries.map((person, index) => (
                <div key={person.name} className={index === 0 ? "mb-4" : ""}>
                  <p className="mb-2 text-sm font-medium text-gray-400">{person.month}</p>
                  <div className="flex items-center gap-3">
                    <DateBadge day={person.day} />
                    <PersonAvatar initials={person.initials} color={person.color} />
                    <p className="text-sm font-semibold text-gray-900">{person.name}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto border-t border-gray-50 px-4 py-3">
              <button className="text-sm font-semibold text-orange-600 hover:text-orange-700">View all</button>
            </div>
          </DashboardCard>

          <DashboardCard className="col-span-6 min-h-0">
            <CardTitle icon={<ClipboardList className="h-4 w-4" />} title="Tasks" />
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-gray-500">
              <ClipboardList className="h-10 w-10 text-gray-300" />
              <p className="text-sm">All caught up! No pending tasks</p>
            </div>
          </DashboardCard>

          <DashboardCard className="col-span-6 min-h-0">
            <CardTitle icon={<Stamp className="h-4 w-4" />} title="Approvals" suffix="(0 pending)" />
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-gray-500">
              <Stamp className="h-10 w-10 text-gray-300" />
              <p className="text-sm">All clear! No pending approvals</p>
            </div>
          </DashboardCard>
        </div>
      </div>
    </AdminDashboardShell>
  );
}
