"use client";

import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-0 pt-16 lg:pt-0 overflow-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
