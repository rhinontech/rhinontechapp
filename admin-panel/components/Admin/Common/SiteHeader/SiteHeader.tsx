"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { LogOut } from "lucide-react";
import { TbUser, TbChevronDown, TbBell } from "react-icons/tb";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

function decodeJWT(token: string): { fullName?: string; companyEmail?: string; roleSlug?: string } {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600", "from-rose-500 to-pink-600",
  "from-emerald-500 to-teal-600", "from-amber-500 to-orange-600", "from-violet-500 to-purple-600",
];
const avatarGradient = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export function SiteHeader() {
  const pathname = usePathname();
  const router   = useRouter();
  const roleSlug = pathname.split("/")[1] || "";

  const currentUser = (() => {
    const token = Cookies.get("authToken");
    if (!token) return { fullName: "User", companyEmail: "" };
    return decodeJWT(token);
  })();

  const name      = currentUser.fullName    ?? "User";
  const firstName = name.split(" ")[0];
  const email     = currentUser.companyEmail ?? "";
  const initial   = name.charAt(0).toUpperCase();

  const logOut = () => {
    Cookies.remove("authToken");
    Cookies.remove("permissions");
    router.push("/auth/login");
  };

  return (
    <div className="flex items-center justify-end rounded-lg bg-white border border-stone-200 px-4 h-[50px] shrink-0 gap-3">

      {/* Notifications */}
      <button className="relative p-1.5 rounded-lg text-gray-400 hover:bg-stone-100 hover:text-gray-700 transition-colors">
        <TbBell size={18} />
      </button>

      <div className="h-5 w-px bg-stone-200" />

      {/* User menu */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition-colors group">
            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${avatarGradient(name)} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
              {initial}
            </div>
            <span className="text-sm font-medium text-gray-700 max-w-[160px] truncate">{firstName}</span>
            <TbChevronDown size={13} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>
        </PopoverTrigger>

        <PopoverContent align="end" className="w-56 p-2">
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGradient(name)} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
              <p className="text-xs text-gray-500 truncate">{email}</p>
            </div>
          </div>
          <div className="border-t pt-1 space-y-0.5">
            <Link
              href={`/${roleSlug}/profile/info`}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <TbUser size={15} /> View Profile
            </Link>
            <button
              onClick={logOut}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-100 rounded-md"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
