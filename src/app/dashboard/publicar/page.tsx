"use client";

import { Card } from "@/components/ui/Card";
import { PropertyForm } from "@/components/property/PropertyForm";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function DashboardPublicarPage() {
  const { allowed } = useAuthGuard(["seller"]);
  if (!allowed) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-title">Publicar Propiedad</h1>
        <p className="text-muted">Agrega una nueva propiedad a tu portafolio</p>
      </div>
      <Card>
        <PropertyForm redirectTo="/dashboard/propiedades" />
      </Card>
    </div>
  );
}
