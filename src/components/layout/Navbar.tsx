"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Menu,
  X,
  Sun,
  Moon,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
  GitCompare,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const { user, logout, toggleTheme, theme } = useApp();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isDashboard) return null;

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-title">InmoConnect</span>
              <span className="text-xs text-muted block -mt-1">habitia</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-secondary bg-secondary/10"
                    : "text-muted hover:text-title hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/comparador"
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1",
                pathname === "/comparador"
                  ? "text-secondary bg-secondary/10"
                  : "text-muted hover:text-title"
              )}
            >
              <GitCompare size={16} />
              Comparar
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted hover:text-title hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Cambiar tema"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {user.role === "seller" && (
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Button>
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      <Shield size={16} />
                      Admin
                    </Button>
                  </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5">
                  <User size={16} className="text-muted" />
                  <span className="text-sm font-medium">{user.firstName}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-muted hover:text-red-500 transition-colors"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/registro">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 text-muted"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-black/5 dark:border-white/5 bg-card p-4 space-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-title hover:bg-black/5"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/comparador" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-title">
            Comparar
          </Link>
          <div className="pt-2 border-t border-black/5 flex gap-2">
            {!user ? (
              <>
                <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full" size="sm">Iniciar sesión</Button>
                </Link>
                <Link href="/registro" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full" size="sm">Registrarse</Button>
                </Link>
              </>
            ) : (
              <Button variant="outline" className="w-full" size="sm" onClick={() => { logout(); setMobileOpen(false); }}>
                Cerrar sesión
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
