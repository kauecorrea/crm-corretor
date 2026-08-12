import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        <main className="flex-1 pb-20 md:pb-6 px-4 md:px-8 pt-6">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
