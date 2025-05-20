"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { User, LogOut, Bell, CreditCard, PlusCircle } from "lucide-react";
import { HiInbox } from "react-icons/hi2";
import { GoHubot } from "react-icons/go";
import { IoBook } from "react-icons/io5";
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
import { BsPinAngleFill } from "react-icons/bs";
import { BsPinAngle } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";
import { RiSettings3Fill } from "react-icons/ri";

const navItems = [
  {
    title: "Engage",
    icon: <HiInbox size={20} className="h-5 w-5 flex-shrink-0" />,
    href: "/admin/engage",
    // badge: 4,
  },
  {
    title: "Rhinon AI Agent",
    icon: <GoHubot size={20} className="h-5 w-5 flex-shrink-0" />,
    href: "/admin/agent",
  },
  {
    title: "Knowledge",
    icon: <IoBook size={20} className="h-5 w-5 flex-shrink-0" />,
    href: "/admin/knowledge/id",
  },
];

const bottomNavItems = [
  {
    title: "Team",
    icon: <FaUserGroup size={20} className="h-5 w-5 flex-shrink-0" />,
    href: "/admin/team",
  },
  {
    title: "Settings",
    icon: <RiSettings3Fill size={20} className="h-5 w-5 flex-shrink-0" />,
    href: "/admin/settings",
  },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarExpanded, setSidebarExpanded, isHovering, setIsHovering } =
    useDashboard();

  const expanded = sidebarExpanded || isHovering;

  const logOut = () => {
    Cookies.remove("authToken");
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
                alt="carousel Image"
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
              alt="carousel Image"
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
                pathname === item.href
                  ? "bg-gray-50 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {item.icon}
              {expanded && (
                <span className="flex-1 truncate">{item.title}</span>
              )}
              {/* {expanded && item.badge && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {item.badge}
                </span>
              )}
              {!expanded && item.badge && (
                <span className="absolute left-9 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {item.badge}
                </span>
              )} */}
            </Link>
          ))}
        </div>

        <div className="space-y-1 px-2">
          {bottomNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {item.icon}
              {expanded && (
                <span className="flex-1 truncate">{item.title}</span>
              )}
            </Link>
          ))}
          {/* Profile Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="group flex w-full items-center justify-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                <div className="flex-shrink-0 bg-white rounded-full p-1">
                  <Image
                    src={adminImages.blueLogo}
                    alt="carousel Image"
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
                  <p className="text-sm font-medium">shadcn</p>
                  <p className="text-xs text-gray-500">m@example.com</p>
                </div>
              </div>
              <div className="mt-2 border-t">
                <Link
                  href="/upgrade"
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                >
                  <PlusCircle className="h-4 w-4" />
                  Upgrade to Pro
                </Link>
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                >
                  <User className="h-4 w-4" />
                  Account
                </Link>
                <Link
                  href="/billing"
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                >
                  <CreditCard className="h-4 w-4" />
                  Billing
                </Link>
                <Link
                  href="/notifications"
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                >
                  <Bell className="h-4 w-4" />
                  Notifications
                </Link>
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-100 rounded-md"
                  onClick={() => logOut()}
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
