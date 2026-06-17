"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { getProperties } from "@/lib/storage";
import { formatPrice, propertyTypeLabel } from "@/lib/utils";

const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function EstadisticasPage() {
  const { user, allowed } = useAuthGuard(["seller"]);
  const [byType, setByType] = useState<{ name: string; value: number }[]>([]);
  const [byStatus, setByStatus] = useState<{ name: string; count: number }[]>([]);
  const [priceData, setPriceData] = useState<{ name: string; precio: number }[]>([]);

  useEffect(() => {
    if (!user) return;
    const props = getProperties().filter((p) => p.sellerId === user.id);

    const typeMap: Record<string, number> = {};
    props.forEach((p) => {
      const label = propertyTypeLabel(p.type);
      typeMap[label] = (typeMap[label] || 0) + 1;
    });
    setByType(Object.entries(typeMap).map(([name, value]) => ({ name, value })));

    const venta = props.filter((p) => p.status === "venta").length;
    const alquiler = props.filter((p) => p.status === "alquiler").length;
    setByStatus([
      { name: "Venta", count: venta },
      { name: "Alquiler", count: alquiler },
    ]);

    setPriceData(
      props.slice(0, 6).map((p) => ({
        name: p.title.slice(0, 15) + "...",
        precio: p.price,
      }))
    );
  }, [user]);

  if (!allowed) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-title">Estadísticas</h1>
        <p className="text-muted">Análisis de tu portafolio de propiedades</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-title mb-4">Propiedades por tipo</h3>
          {byType.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={byType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {byType.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted text-center py-12">Sin datos</p>
          )}
        </Card>

        <Card>
          <h3 className="font-semibold text-title mb-4">Venta vs Alquiler</h3>
          {byStatus.some((s) => s.count > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={byStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted text-center py-12">Sin datos</p>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="font-semibold text-title mb-4">Precios por propiedad</h3>
          {priceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => formatPrice(Number(v))} />
                <Line type="monotone" dataKey="precio" stroke="#2563EB" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted text-center py-12">Sin datos</p>
          )}
        </Card>
      </div>
    </div>
  );
}
