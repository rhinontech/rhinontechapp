"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { MdDashboard, MdOutlineCloud } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { RiSettings3Fill } from "react-icons/ri";
import { HiInbox } from "react-icons/hi2";
import { TbCash } from "react-icons/tb";
import { BsPinAngleFill, BsPinAngle } from "react-icons/bs";
import { cn } from "@/lib/utils";
import { useDashboard } from "../../../Common/DashboardProvider/DashboardProvider";
import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import Cookies from "js-cookie";
import adminImages from "@/constants/admin/images";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarExpanded, setSidebarExpanded, isHovering, setIsHovering } =
    useDashboard();

  const roleSlug = pathname.split("/")[1] || "";
  const permissions: string[] = (() => {
    try {
      return JSON.parse(Cookies.get("permissions") || "[]");
    } catch {
      return [];
    }
  })();

  const expanded = sidebarExpanded || isHovering;

  const navItems = [
    {
      title: "Dashboard",
      icon: <MdDashboard size={20} className="h-5 w-5 flex-shrink-0" />,
      href: `/${roleSlug}/dashboard`,
      permission: "dashboard:read",
    },
    {
      title: "Inbox",
      icon: <HiInbox size={20} className="h-5 w-5 flex-shrink-0" />,
      href: `/${roleSlug}/inbox`,
      permission: "dashboard:read",
    },
    {
      title: "Employees",
      icon: <FaUserGroup size={20} className="h-5 w-5 flex-shrink-0" />,
      href: `/${roleSlug}/employees`,
      permission: "employees:read",
    },
    {
      title: "Payroll",
      icon: <TbCash size={20} className="h-5 w-5 flex-shrink-0" />,
      href: `/${roleSlug}/payroll`,
      permission: "payslips:read",
    },
    {
      title: "Provisioning",
      icon: <MdOutlineCloud size={20} className="h-5 w-5 flex-shrink-0" />,
      href: `/${roleSlug}/provisioning`,
      permission: "provisioning:read",
    },
    {
      title: "Settings",
      icon: <RiSettings3Fill size={20} className="h-5 w-5 flex-shrink-0" />,
      href: `/${roleSlug}/settings`,
      permission: "settings:read",
    },
  ].filter((item) => permissions.includes(item.permission));

  const logOut = () => {
    Cookies.remove("authToken");
    Cookies.remove("permissions");
    router.push("/auth/login");
  };

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-stone-200 transition-all duration-300 ease-in-out",
        expanded ? "w-56" : "w-14"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex h-14 items-center justify-center border-b w-full">
        {expanded ? (
          <div className="flex items-center justify-between w-full">
            <Link href="/">
              <Image
                src={adminImages.Logo_Rhinon_Tech_Dark}
                alt="Rhinon Tech"
                className="h-10 w-full object-cover"
              />
            </Link>
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="p-1 rounded bg-stone-300 hover:bg-gray-300 transition-all"
            >
              {sidebarExpanded ? (
                <BsPinAngleFill size={14} />
              ) : (
                <BsPinAngle size={14} />
              )}
            </button>
          </div>
        ) : (
          <Link href="/">
            <Image
              src={adminImages.blueLogo}
              alt="Rhinon Tech"
              className="h-8 w-8 object-cover"
            />
          </Link>
        )}
      </div>

      <nav className="flex flex-1 flex-col justify-between py-4">
        <div className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith(item.href)
                  ? "bg-gray-50 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {item.icon}
              {expanded && (
                <span className="flex-1 truncate">{item.title}</span>
              )}
            </Link>
          ))}
        </div>

        <div className="space-y-1 px-2">
          <Popover>
            <PopoverTrigger asChild>
              <button className="group flex w-full items-center justify-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                <div className="flex-shrink-0 bg-white rounded-full p-1">
                  <Image
                    src={adminImages.blueLogo}
                    alt="Profile"
                    className="h-5 w-5 object-cover"
                  />
                </div>
                {expanded && (
                  <span className="flex-1 truncate text-left">Profile</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="center" className="w-64 p-2">
              <div className="flex items-center gap-3 p-2">
                <Image
                  src={adminImages.blueLogo}
                  alt="Profile"
                  className="h-10 w-10 object-cover rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">User</p>
                  <p className="text-xs text-gray-500">user@rhinontech.in</p>
                </div>
              </div>
              <div className="mt-2 border-t">
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-100 rounded-md"
                  onClick={logOut}
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </nav>
    </aside>
  );
}
