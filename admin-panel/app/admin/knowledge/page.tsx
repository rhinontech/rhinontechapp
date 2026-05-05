"use client";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function KnowledgePage() {
  const router = useRouter();
  useEffect(() => {
    router.push("knowledge/id");
  }, []);
  return (
    // <AdminDashboardShell>
    //   <div className="flex gap-2 w-full h-full">
    //     <div
    //       className={`overflow-hidden flex w-full ${
    //         isSideNavExpanded ? "gap-2" : ""
    //       }
    //       `}
    //     >
    //       <aside
    //         className={`flex h-full flex-col bg-stone-100 rounded-l-xl transition-all duration-200 ease-in-out rounded-xl shadow-md ${
    //           isSideNavExpanded ? "w-[20%]" : "w-0"
    //         }`}
    //       >
    //         {isSideNavExpanded ? (
    //           <div className="flex h-14 items-center justify-center border-b">
    //             data
    //           </div>
    //         ) : (
    //           <></>
    //         )}
    //       </aside>
    //       <main
    //         className={`flex flex-col bg-white rounded-xl shadow-md w-full`}
    //       >
    //         <button onClick={() => setIsSideNavExpanded(!isSideNavExpanded)}>
    //           {isSideNavExpanded ? "Close" : "Open"}
    //         </button>
    //       </main>
    //     </div>
    //   </div>
    // </AdminDashboardShell>
    <>
      <Loading />
    </>
  );
}
