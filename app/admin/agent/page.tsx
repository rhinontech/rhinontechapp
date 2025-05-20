"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/app/loading";

export default function AgentPage() {
  const router = useRouter();
  useEffect(() => {
    router.push("agent/content");
  }, []);
  return (
    <>
      <Loading />
    </>
  );
}
