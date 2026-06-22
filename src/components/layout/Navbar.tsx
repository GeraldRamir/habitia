"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sun,
  Moon,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
  GitCompare,
  Heart,
  MessageCircle,
  Settings,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const { user, logout, toggleTheme, theme } = useApp();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isDashboard) return null;

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-[88px]">
          <Link href="/" className="shrink-0 group" translate="no">
            <span className="font-bold text-4xl md:text-5xl text-primary tracking-tight lowercase transition-opacity group-hover:opacity-80">
              habitia
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <Link
              href="/propiedades"
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors border-b-2",
                pathname === "/propiedades" || pathname.startsWith("/propiedades/")
                  ? "text-title border-title"
                  : "text-muted border-transparent hover:text-title"
              )}
            >
              Explorar
            </Link>
            <Link
              href="/favoritos"
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors border-b-2",
                pathname === "/favoritos"
                  ? "text-title border-title"
                  : "text-muted border-transparent hover:text-title"
              )}
            >
              Favoritos
            </Link>
            <Link
              href="/planes"
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors border-b-2",
                pathname === "/planes" || pathname === "/#planes"
                  ? "text-title border-title"
                  : "text-muted border-transparent hover:text-title"
              )}
            >
              Planes
            </Link>
            <Link
              href="/publicar"
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors border-b-2",
                pathname === "/publicar"
                  ? "text-title border-title"
                  : "text-muted border-transparent hover:text-title"
              )}
            >
              Publicar propiedad
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link
              href="/comparador"
              className="p-2 rounded-full text-muted hover:bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              aria-label="Comparador de propiedades"
            >
              <GitCompare size={18} aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted hover:bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              aria-label="Cambiar tema"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-1.5 pl-1" ref={userMenuRef}>
                {user.role === "seller" && (
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="rounded-full !border-border">
                      <LayoutDashboard size={16} aria-hidden="true" />
                      <span className="hidden xl:inline">Dashboard</span>
                    </Button>
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="rounded-full !border-border">
                      <Shield size={16} aria-hidden="true" />
                      <span className="hidden xl:inline">Admin</span>
                    </Button>
                  </Link>
                )}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="flex items-center gap-2 pl-2 pr-1 py-1.5 rounded-full border border-border hover:shadow-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                    aria-label={`Menú de ${user.firstName}`}
                    aria-expanded={userMenuOpen}
                  >
                    <Menu size={16} className="text-muted ml-1" aria-hidden="true" />
                    <div className="w-7 h-7 rounded-full bg-secondary/15 flex items-center justify-center">
                      <User size={14} className="text-secondary" aria-hidden="true" />
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 py-2 bg-card rounded-xl border border-border shadow-lg z-50">
                      <p className="px-4 py-2 text-sm font-semibold text-title border-b border-border mb-1">
                        {user.firstName} {user.lastName}
                      </p>
                      <Link
                        href="/favoritos"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-title hover:bg-background"
                      >
                        <Heart size={16} aria-hidden="true" />
                        Favoritos
                      </Link>
                      <Link
                        href="/mensajes"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-title hover:bg-background"
                      >
                        <MessageCircle size={16} aria-hidden="true" />
                        Mensajes
                      </Link>
                      {user.role === "seller" && (
                        <Link
                          href="/dashboard/configuracion"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-title hover:bg-background"
                        >
                          <Settings size={16} aria-hidden="true" />
                          Configuración
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-background"
                      >
                        <LogOut size={16} aria-hidden="true" />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="rounded-full !border-border font-medium">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/registro">
                  <Button size="sm" className="rounded-full font-medium">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-muted rounded-full hover:bg-background"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-title hover:bg-background"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/comparador"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-title hover:bg-background"
          >
            Comparar
          </Link>
          <div className="pt-2 border-t border-border flex gap-2">
            {!user ? (
              <>
                <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full" size="sm">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/registro" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full" size="sm">
                    Registrarse
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                size="sm"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
              >
                Cerrar sesión
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
