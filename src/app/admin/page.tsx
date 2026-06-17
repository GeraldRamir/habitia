"use client";

import { useEffect, useState } from "react";
import { Users, Building2, Flag, Shield } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { getUsers, getProperties, getReports } from "@/lib/storage";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AdminPage() {
  const { allowed } = useAuthGuard(["admin"]);
  const [stats, setStats] = useState({ users: 0, properties: 0, reports: 0, sellers: 0 });

  useEffect(() => {
    setStats({
      users: getUsers().length,
      properties: getProperties().length,
      reports: getReports().filter((r) => r.status === "pending").length,
      sellers: getUsers().filter((u) => u.role === "seller").length,
    });
  }, []);

  if (!allowed) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-title flex items-center gap-2">
          <Shield size={24} className="text-secondary" />
          Panel de Administración
        </h1>
        <p className="text-muted">Gestión general de habitia</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: Users, label: "Usuarios", value: stats.users, href: "/admin/usuarios" },
          { icon: Building2, label: "Propiedades", value: stats.properties, href: "/admin/propiedades" },
          { icon: Flag, label: "Reportes pendientes", value: stats.reports, href: "/admin/reportes" },
          { icon: Shield, label: "Vendedores", value: stats.sellers, href: "/admin/usuarios" },
        ].map((item) => (
          <Link key={item.label} href={item.href}>
            <Card hover className="cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <item.icon size={20} className="text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted">{item.label}</p>
                  <p className="text-xl font-bold text-title">{item.value}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <h2 className="font-semibold text-title mb-4">Acciones de administración</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/usuarios"><Button>Gestionar usuarios</Button></Link>
          <Link href="/admin/propiedades"><Button variant="outline">Gestionar propiedades</Button></Link>
          <Link href="/admin/reportes"><Button variant="outline">Ver reportes</Button></Link>
        </div>
      </Card>
    </div>
  );
}
