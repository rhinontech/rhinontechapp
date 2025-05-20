"use client"
import { useSideNav } from "@/context/SideNavContext";
import React from "react";

const page = () => {
  const { isExpanded, toggleSideNav } = useSideNav();
  return (
    <div>
      <button onClick={toggleSideNav}>{isExpanded ? "Close" : "Open"}</button>
      This is dummy page
    </div>
  );
};

export default page;
