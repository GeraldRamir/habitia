"use client";

import { useEffect, useState } from "react";
import { Building2, Eye, MessageCircle, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { getProperties, getConversations } from "@/lib/storage";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const { user, allowed } = useAuthGuard(["seller"]);
  const [stats, setStats] = useState({ total: 0, active: 0, messages: 0, totalValue: 0 });

  useEffect(() => {
    if (!user) return;
    const props = getProperties().filter((p) => p.sellerId === user.id);
    const convs = getConversations().filter((c) => c.sellerId === user.id);
    setStats({
      total: props.length,
      active: props.filter((p) => p.active).length,
      messages: convs.length,
      totalValue: props.reduce((s, p) => s + p.price, 0),
    });
  }, [user]);

  if (!allowed) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-title">Panel Principal</h1>
        <p className="text-muted">Bienvenido, {user?.firstName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: Building2, label: "Mis propiedades", value: stats.total, color: "text-secondary" },
          { icon: Eye, label: "Activas", value: stats.active, color: "text-success" },
          { icon: MessageCircle, label: "Conversaciones", value: stats.messages, color: "text-warning" },
          { icon: TrendingUp, label: "Valor total", value: formatPrice(stats.totalValue), color: "text-secondary" },
        ].map((item) => (
          <Card key={item.label}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <item.icon size={20} className={item.color} />
              </div>
              <div>
                <p className="text-sm text-muted">{item.label}</p>
                <p className="text-xl font-bold text-title">{item.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="font-semibold text-title mb-4">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/publicar"><Button>Publicar propiedad</Button></Link>
          <Link href="/dashboard/propiedades"><Button variant="outline">Ver mis propiedades</Button></Link>
          <Link href="/dashboard/mensajes"><Button variant="outline">Ver mensajes</Button></Link>
        </div>
      </Card>
    </div>
  );
}
