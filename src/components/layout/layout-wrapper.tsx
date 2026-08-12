"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return (
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        <main className="flex-1 pb-20 md:pb-6 px-4 md:px-8 pt-6">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </>
  );
}
