"use client";
import React, { useState } from "react";
import { useSideNav } from "@/context/SideNavContext";
import {
  TbLayoutSidebarFilled,
  TbLayoutSidebarRightFilled,
} from "react-icons/tb";
import CustomDropdown from "@/components/UIComponents/CustomDropdown";
import Details from "./Details/Details";
import Copilot from "./Copilot/Copilot";

const Inbox = () => {
  const { isExpanded, toggleSideNav } = useSideNav();
  const [activeTab, setActiveTab] = useState<"details" | "copilot">("details");
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState("Open");

  const statusOptions = [
    {
      value: "Open",
      label: "Open",
      showIcons: true,
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 10C3 8.34315 4.34315 7 6 7H18C19.6569 7 21 8.34315 21 10V16C21 17.6569 19.6569 19 18 19H6C4.34315 19 3 17.6569 3 16V10Z"
            fill="#E67E22"
            fillOpacity="0.2"
            stroke="#E67E22"
            strokeWidth="2"
          />
          <path
            d="M4 7V5C4 3.89543 4.89543 3 6 3H18C19.1046 3 20 3.89543 20 5V7"
            stroke="#E67E22"
            strokeWidth="2"
          />
          <path
            d="M12 11V15"
            stroke="#E67E22"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M9 13H15"
            stroke="#E67E22"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    { value: "Closed", label: "Closed", extraInfo: "3d" },
    { value: "In-progress", label: "In-Progress" },
    { value: "Resolved", label: "Resolved" },
  ];

  return (
    <div className="flex gap-2 w-full h-full">
      <div
        className={`flex flex-col bg-stone-100 rounded-r-xl w-[40%] h-full overflow-hidden ${
          isExpanded ? "border-l rounded-r-xl" : "rounded-xl"
        }`}
      >
        <div className="sticky top-0 bg-stone-100 z-10 flex items-center gap-4 h-16 px-5 border-b">
          <div className="cursor-pointer" onClick={toggleSideNav}>
            {isExpanded ? (
              <TbLayoutSidebarFilled size={20} />
            ) : (
              <TbLayoutSidebarRightFilled size={20} />
            )}
          </div>
          <h1 className="text-xl font-bold tracking-tight">Inbox</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-2 py-2 flex items-center justify-between">
            <CustomDropdown
              options={statusOptions}
              selectedValue={selectedStatus}
              onSelect={setSelectedStatus}
              label={`${selectedStatus}`}
            />
            <CustomDropdown
              options={statusOptions}
              selectedValue={selectedStatus}
              onSelect={setSelectedStatus}
              label={`${selectedStatus}`}
            />
          </div>
          <p className="h-[300px]">Hey</p>
        </div>
      </div>

      <main className="flex flex-col bg-white rounded-xl shadow-md w-full h-full overflow-hidden">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between gap-4 h-16 px-5 border-b">
          <h1 className="text-xl font-bold tracking-tight">Phone & Message</h1>
          <div
            className="cursor-pointer"
            onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
          >
            {!isPreviewExpanded && <TbLayoutSidebarFilled size={20} />}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 px-5 py-4 overflow-auto">
          <p className="h-[300px]">Inbox content</p>
        </div>
      </main>

      <aside
        className={`flex h-full flex-col bg-white rounded-l-xl transition-all duration-200 ease-in-out rounded-xl shadow-md ${
          isPreviewExpanded ? "w-[65%]" : "w-0"
        }`}
      >
        {isPreviewExpanded && (
          <div className="flex flex-col w-full flex-1 h-full overflow-hidden relative">
            <div className="sticky top-0 w-full flex items-center justify-between h-16 px-5 py-4 border-b bg-white z-10 rounded-t-xl">
              <div className="flex items-center gap-4 h-16">
                <p
                  className={`flex items-center text-md font-medium tracking-tight h-full cursor-pointer ${
                    activeTab === "details"
                      ? "border-b-2 border-blue-600 text-black"
                      : "border-b-2 border-transparent text-gray-600"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </p>
                <p
                  className={`flex items-center text-md font-medium tracking-tight h-full cursor-pointer ${
                    activeTab === "copilot"
                      ? "border-b-2 border-blue-600 text-black"
                      : "border-b-2 border-transparent text-gray-600"
                  }`}
                  onClick={() => setActiveTab("copilot")}
                >
                  Copilot
                </p>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
              >
                {isPreviewExpanded && <TbLayoutSidebarRightFilled size={20} />}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto">
              {activeTab === "details" && <Details />}
              {activeTab === "copilot" && <Copilot />}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default Inbox;
