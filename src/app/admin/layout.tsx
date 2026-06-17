"use client";

import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 lg:ml-0 pt-16 lg:pt-0 overflow-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
