"use client"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Shield, UserCog, Headphones } from "lucide-react";

const roles = [
  {
    id: "SuperAdmin",
    label: "Super Admin",
    description: "Full platform access and control",
    icon: <Shield className="h-8 w-8" />,
    color: "text-purple-600",
    bg: "hover:bg-purple-50 hover:border-purple-300",
  },
  {
    id: "Admin",
    label: "Admin",
    description: "Manage workspace, agents and settings",
    icon: <UserCog className="h-8 w-8" />,
    color: "text-blue-600",
    bg: "hover:bg-blue-50 hover:border-blue-300",
  },
  {
    id: "Support",
    label: "Support",
    description: "Handle conversations and tickets",
    icon: <Headphones className="h-8 w-8" />,
    color: "text-green-600",
    bg: "hover:bg-green-50 hover:border-green-300",
  },
];

export function Login({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const loginAs = (role: string) => {
    Cookies.set("authToken", "dummyToken");
    Cookies.set("currentRole", role);
    router.push("/");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance mt-1">
                  Select your role to continue
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => loginAs(role.id)}
                    className={cn(
                      "flex items-center gap-4 rounded-xl border border-border p-4 text-left transition-all duration-150",
                      role.bg
                    )}
                  >
                    <span className={role.color}>{role.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{role.label}</p>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
