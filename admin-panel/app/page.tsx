"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import Loading from "./loading";

export default function Home() {
  const router = useRouter();

  const redirectAccToUserRole = (userRole: string) => {
    switch (userRole) {
      case "SuperAdmin":
        router.push("/superadmin/dashboard");
        break;
      case "Admin":
        router.push("/admin/dashboard");
        break;
      case "Support":
        router.push("/support/dashboard");
        break;
    }
  };

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    const currentRole = Cookies.get("currentRole");
    if (authToken && currentRole) {
      redirectAccToUserRole(currentRole);
    } else {
      Cookies.remove("authToken");
      Cookies.remove("currentRole");
      router.push("/auth/login");
    }
  }, []);

  return (
    <>
      <Loading />
    </>
  );
}
