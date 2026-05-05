"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type DashboardContextType = {
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  isHovering: boolean;
  setIsHovering: (hovering: boolean) => void;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const isDashboardRoute = (path: string) => /^\/[^/]+\/dashboard$/.test(path);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarExpanded, setSidebarExpanded] = useState(isDashboardRoute(pathname));
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setSidebarExpanded(isDashboardRoute(pathname));
  }, [pathname]);

  return (
    <DashboardContext.Provider
      value={{ sidebarExpanded, setSidebarExpanded, isHovering, setIsHovering }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
