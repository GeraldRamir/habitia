"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GitCompare, X } from "lucide-react";
import { getCompareList, getProperties, toggleCompare } from "@/lib/storage";
import { formatPrice, propertyTypeLabel, statusLabel } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";
import type { Property } from "@/lib/types";

export default function ComparadorPage() {
  const { addToast } = useApp();
  const [properties, setProperties] = useState<Property[]>([]);

  const load = () => {
    const ids = getCompareList();
    const all = getProperties();
    setProperties(all.filter((p) => ids.includes(p.id)));
  };

  useEffect(() => { load(); }, []);

  const remove = (id: string) => {
    toggleCompare(id);
    load();
    addToast("Eliminado del comparador");
  };

  const rows = [
    { label: "Precio", key: "price" as const, format: (p: Property) => formatPrice(p.price, p.status) },
    { label: "Tipo", key: "type" as const, format: (p: Property) => propertyTypeLabel(p.type) },
    { label: "Operación", key: "status" as const, format: (p: Property) => statusLabel(p.status) },
    { label: "Ciudad", key: "city" as const },
    { label: "Habitaciones", key: "bedrooms" as const },
    { label: "Baños", key: "bathrooms" as const },
    { label: "Parqueos", key: "parking" as const },
    { label: "Área (m²)", key: "area" as const },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-title mb-2">Comparador de propiedades</h1>
      <p className="text-muted mb-8">Compara hasta 3 propiedades lado a lado</p>

      {properties.length === 0 ? (
        <EmptyState
          icon={<GitCompare size={32} />}
          title="No hay propiedades para comparar"
          description="Agrega propiedades desde el listado usando el botón de comparar"
          action={{ label: "Ver propiedades", href: "/propiedades" }}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full card !p-0 overflow-hidden">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5">
                <th className="p-4 text-left text-sm font-medium text-muted w-32">Característica</th>
                {properties.map((p) => (
                  <th key={p.id} className="p-4 text-left min-w-[200px]">
                    <div className="relative">
                      <button onClick={() => remove(p.id)} className="absolute -top-1 -right-1 text-muted hover:text-red-500">
                        <X size={16} />
                      </button>
                      <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                        <Image src={p.images[0]} alt="" fill className="object-cover" sizes="200px" />
                      </div>
                      <Link href={`/propiedades/${p.id}`} className="text-sm font-semibold text-title hover:text-secondary line-clamp-2">
                        {p.title}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-black/5 dark:border-white/5">
                  <td className="p-4 text-sm font-medium text-muted">{row.label}</td>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4 text-sm text-title">
                      {row.format ? row.format(p) : String(p[row.key])}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-4 text-sm font-medium text-muted">Amenidades</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-4 text-sm text-muted">
                    {p.amenities.length > 0 ? p.amenities.join(", ") : "—"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {properties.length > 0 && properties.length < 3 && (
        <div className="mt-6 text-center">
          <Link href="/propiedades">
            <Button variant="outline">Agregar más propiedades</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
