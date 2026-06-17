"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { PropertyForm } from "@/components/property/PropertyForm";
import { useApp } from "@/context/AppContext";

export default function PublicarPage() {
  const { user, ready } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "seller" && user.role !== "admin") {
      router.replace("/registro");
    }
  }, [user, ready, router]);

  if (!ready || !user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-title">Publicar propiedad</h1>
        <p className="text-muted mt-2">Completa los datos de tu propiedad</p>
      </div>
      <Card>
        <PropertyForm redirectTo="/propiedades" />
      </Card>
    </div>
  );
}
