"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  BarChart3,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { SELLER_SIDEBAR } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutDashboard,
  Building2,
  PlusCircle,
  BarChart3,
  MessageCircle,
  Settings,
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useApp();
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
          <Link href="/dashboard" className="block">
            <span className="font-bold text-lg lowercase" translate="no">habitia</span>
            <span className="text-xs text-gray-400 block">Panel de vendedor</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {SELLER_SIDEBAR.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-white"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          {user && (
            <p className="text-sm text-gray-400 mb-3 px-4">
              {user.firstName} {user.lastName}
            </p>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-white/10 hover:text-white w-full transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors mt-1"
          >
            Volver al sitio
          </Link>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}
    </>
  );
}
