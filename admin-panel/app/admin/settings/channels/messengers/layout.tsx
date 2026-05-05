"use client";
import { usePathname, useRouter } from "next/navigation";
import { useSideNav } from "@/context/SideNavContext";
import {
  TbLayoutSidebarFilled,
  TbLayoutSidebarRightFilled,
} from "react-icons/tb";

export default function MessengersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex h-full w-full flex-col">
      <LayoutContent>{children}</LayoutContent>
    </main>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, toggleSideNav } = useSideNav();
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="flex flex-col bg-white rounded-xl w-full h-full flex-1 min-h-0">
      {/* Fixed Header */}
      <div className="sticky top-0 w-full flex flex-col justify-between bg-white z-10 rounded-t-xl">
        <div className="px-6 py-4 flex items-center gap-4">
          <div className="cursor-pointer" onClick={toggleSideNav}>
            {isExpanded ? (
              <TbLayoutSidebarFilled size={20} />
            ) : (
              <TbLayoutSidebarRightFilled size={20} />
            )}
          </div>
          <h1 className="text-xl font-bold tracking-tight">Messengers</h1>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-6 px-6 border-b">
          <p
            className={`flex items-center text-md font-medium tracking-tight h-full cursor-pointer pb-2 ${
              pathname.endsWith("/web")
                ? "border-b-2 border-blue-600 text-black"
                : "border-b-2 border-transparent text-gray-600"
            }`}
            onClick={() =>
              router.push("/admin/settings/channels/messengers/web")
            }
          >
            Web
          </p>
          <p
            className={`flex items-center text-md font-medium tracking-tight h-full cursor-pointer pb-2 ${
              pathname.endsWith("/conversations")
                ? "border-b-2 border-blue-600 text-black"
                : "border-b-2 border-transparent text-gray-600"
            }`}
            onClick={() =>
              router.push("/admin/settings/channels/messengers/conversations")
            }
          >
            Conversations
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-auto h-full">{children}</div>
    </div>
  );
}
