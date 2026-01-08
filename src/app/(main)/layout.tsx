import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { AppSidebar } from "@/components/appSidebar/AppsideBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "../globals.css";

export const metadata: Metadata = {
  title: "PASS IT ALONG - Dashboard",
  description: "PASS IT ALONG - Dashboard",
  icons: {
    icon: [{ url: "/favicon_white.svg", type: "image/svg+xml" }],
  },
  manifest: "/site.webmanifest",
};

import CrossTabLogoutHandler from "@/components/CrossTabLogoutHandler";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <>
      <CrossTabLogoutHandler />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-gray-100 h-screen flex flex-col">
          {/* <Header /> */}
          <main className="flex-1 p-4 overflow-auto min-w-0">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
