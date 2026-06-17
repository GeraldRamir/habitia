"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { getProperties, updateProperty, deleteProperty, getUserById } from "@/lib/storage";
import { useApp } from "@/context/AppContext";
import type { Property } from "@/lib/types";
import { formatPrice, statusLabel } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import { Eye, EyeOff, Trash2 } from "lucide-react";

export default function AdminPropiedadesPage() {
  const { allowed } = useAuthGuard(["admin"]);
  const { addToast } = useApp();
  const [properties, setProperties] = useState<Property[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => setProperties(getProperties());

  useEffect(() => { load(); }, []);

  const toggleActive = (id: string, active: boolean) => {
    updateProperty(id, { active: !active });
    addToast(active ? "Propiedad desactivada" : "Propiedad activada");
    load();
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteProperty(deleteId);
    addToast("Propiedad eliminada");
    setDeleteId(null);
    load();
  };

  if (!allowed) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-title">Propiedades</h1>
        <p className="text-muted">{properties.length} propiedades en el sistema</p>
      </div>

      <div className="space-y-4">
        {properties.map((p) => {
          const seller = getUserById(p.sellerId);
          return (
            <div key={p.id} className="card flex flex-col md:flex-row gap-4 p-4">
              <div className="relative w-full md:w-40 h-28 rounded-xl overflow-hidden shrink-0">
                <Image src={p.images[0]} alt="" fill className="object-cover" sizes="160px" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-title">{p.title}</h3>
                    <p className="text-sm text-muted">
                      {seller ? `${seller.firstName} ${seller.lastName}` : "—"} · {p.city} · {statusLabel(p.status)}
                    </p>
                    <p className="text-lg font-bold text-secondary mt-1">{formatPrice(p.price, p.status)}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.active ? "bg-success/10 text-success" : "bg-gray-100 text-muted"}`}>
                    {p.active ? "Activa" : "Inactiva"}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href={`/propiedades/${p.id}`}>
                    <Button variant="outline" size="sm">Ver</Button>
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
          );
        })}
      </div>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar propiedad"
        message="¿Estás seguro de eliminar esta propiedad?"
        confirmLabel="Eliminar"
        danger
      />
    </div>
  );
}
