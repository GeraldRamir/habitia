"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Users, Building2, Flag, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { ADMIN_SIDEBAR } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Shield,
  Users,
  Building2,
  Flag,
};

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card shadow-lg"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0d1b2a] text-white flex flex-col transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="block">
            <span className="font-bold text-lg flex items-center gap-2">
              <Shield size={20} className="text-secondary" />
              Admin Panel
            </span>
            <span className="text-xs text-gray-400 block">habitia</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {ADMIN_SIDEBAR.map((item) => {
            const Icon = iconMap[item.icon] || Shield;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  active ? "bg-secondary text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-white/10 hover:text-white w-full transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}
    </>
  );
}
