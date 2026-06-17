"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { getProperties, deleteProperty, updateProperty } from "@/lib/storage";
import { formatPrice, statusLabel } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useApp } from "@/context/AppContext";
import type { Property } from "@/lib/types";
import { Building2 } from "lucide-react";

export default function MisPropiedadesPage() {
  const { user, allowed } = useAuthGuard(["seller"]);
  const { addToast } = useApp();
  const [properties, setProperties] = useState<Property[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    if (!user) return;
    setProperties(getProperties().filter((p) => p.sellerId === user.id));
  };

  useEffect(() => { load(); }, [user]);

  const handleDelete = () => {
    if (!deleteId) return;
    deleteProperty(deleteId);
    addToast("Propiedad eliminada");
    setDeleteId(null);
    load();
  };

  const toggleActive = (id: string, active: boolean) => {
    updateProperty(id, { active: !active });
    addToast(active ? "Propiedad desactivada" : "Propiedad activada");
    load();
  };

  if (!allowed) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-title">Mis Propiedades</h1>
          <p className="text-muted">{properties.length} propiedades</p>
        </div>
        <Link href="/dashboard/publicar"><Button>Publicar nueva</Button></Link>
      </div>

      {properties.length === 0 ? (
        <EmptyState
          icon={<Building2 size={32} />}
          title="No tienes propiedades"
          description="Publica tu primera propiedad"
          action={{ label: "Publicar", href: "/dashboard/publicar" }}
        />
      ) : (
        <div className="space-y-4">
          {properties.map((p) => (
            <div key={p.id} className="card flex flex-col md:flex-row gap-4 p-4">
              <div className="relative w-full md:w-40 h-28 rounded-xl overflow-hidden shrink-0">
                <Image src={p.images[0]} alt="" fill className="object-cover" sizes="160px" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-title">{p.title}</h3>
                    <p className="text-sm text-muted">{p.city} · {statusLabel(p.status)}</p>
                    <p className="text-lg font-bold text-secondary mt-1">{formatPrice(p.price, p.status)}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.active ? "bg-success/10 text-success" : "bg-gray-100 text-muted"}`}>
                    {p.active ? "Activa" : "Inactiva"}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href={`/propiedades/${p.id}`}>
                    <Button variant="outline" size="sm"><Eye size={14} /> Ver</Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => toggleActive(p.id, p.active)}>
                    {p.active ? <><EyeOff size={14} /> Desactivar</> : <><Eye size={14} /> Activar</>}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeleteId(p.id)}>
                    <Trash2 size={14} className="text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar propiedad"
        message="¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        danger
      />
    </div>
  );
}
