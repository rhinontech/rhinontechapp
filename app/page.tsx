"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import Loading from "./loading";

export default function Home() {
  const router = useRouter();
  //   const authToken = Cookies.get("authToken");

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
    if (authToken) {
      // fetchIpAddress(userEmail, provider);
      Cookies.set("currentRole", "admin");
      redirectAccToUserRole("Admin");
    } else {
      // the user will be redirected to the login page after 1000 millisecound.
      Cookies.remove("authToken");
      router.push("/auth/login");
    }
  }, []);

  return (
    <>
      <Loading />
    </>
  );
}
