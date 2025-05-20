"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/app/loading";

export default function EngagePage() {
  const router = useRouter();
  useEffect(() => {
    router.push("billings/overview",);
  }, []);
  return (
    <>
      <Loading />
    </>
  );
}
