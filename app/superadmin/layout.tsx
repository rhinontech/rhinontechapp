import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "uExcelerate - Leadership enablement platform",
  description:
    "uExcelerate is a leadership enablement platform for your personalised learning journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full flex-col">
      {children}
    </main>
  );
}
