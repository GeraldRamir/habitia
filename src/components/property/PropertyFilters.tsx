"use client";

import type { PropertyFilters as Filters } from "@/lib/types";
import { CITIES, PROPERTY_TYPES } from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface PropertyFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClear: () => void;
}

export function PropertyFilters({ filters, onChange, onClear }: PropertyFiltersProps) {
  const update = (key: keyof Filters, value: string | number | undefined) => {
    onChange({ ...filters, [key]: value || undefined });
  };

  return (
    <aside className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-title">Filtros</h3>
        <button onClick={onClear} className="text-sm text-secondary hover:underline flex items-center gap-1">
          <X size={14} />
          Limpiar
        </button>
      </div>

      <Input
        label="Buscar"
        placeholder="Título, ciudad..."
        value={filters.search || ""}
        onChange={(e) => update("search", e.target.value)}
      />

      <Select
        label="Ciudad"
        value={filters.city || ""}
        onChange={(e) => update("city", e.target.value)}
        options={[{ value: "", label: "Todas" }, ...CITIES.map((c) => ({ value: c, label: c }))]}
      />

      <Select
        label="Tipo"
        value={filters.type || ""}
        onChange={(e) => update("type", e.target.value)}
        options={[{ value: "", label: "Todos" }, ...PROPERTY_TYPES]}
      />

      <Select
        label="Operación"
        value={filters.status || ""}
        onChange={(e) => update("status", e.target.value)}
        options={[
          { value: "", label: "Todas" },
          { value: "venta", label: "Venta" },
          { value: "alquiler", label: "Alquiler" },
        ]}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Precio mín."
          type="number"
          placeholder="0"
          value={filters.minPrice || ""}
          onChange={(e) => update("minPrice", e.target.value ? Number(e.target.value) : undefined)}
        />
        <Input
          label="Precio máx."
          type="number"
          placeholder="∞"
          value={filters.maxPrice || ""}
          onChange={(e) => update("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Habitaciones"
          type="number"
          min={0}
          value={filters.bedrooms || ""}
          onChange={(e) => update("bedrooms", e.target.value ? Number(e.target.value) : undefined)}
        />
        <Input
          label="Baños"
          type="number"
          min={0}
          value={filters.bathrooms || ""}
          onChange={(e) => update("bathrooms", e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      <Select
        label="Ordenar por"
        value={filters.sort || "recent"}
        onChange={(e) => update("sort", e.target.value)}
        options={[
          { value: "recent", label: "Más recientes" },
          { value: "price-asc", label: "Precio: menor a mayor" },
          { value: "price-desc", label: "Precio: mayor a menor" },
        ]}
      />
    </aside>
  );
}

export function filterProperties(
  properties: import("@/lib/types").Property[],
  filters: Filters
) {
  let result = properties.filter((p) => p.active);

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
    );
  }
  if (filters.city) result = result.filter((p) => p.city === filters.city);
  if (filters.type) result = result.filter((p) => p.type === filters.type);
  if (filters.status) result = result.filter((p) => p.status === filters.status);
  if (filters.minPrice) result = result.filter((p) => p.price >= filters.minPrice!);
  if (filters.maxPrice) result = result.filter((p) => p.price <= filters.maxPrice!);
  if (filters.bedrooms) result = result.filter((p) => p.bedrooms >= filters.bedrooms!);
  if (filters.bathrooms) result = result.filter((p) => p.bathrooms >= filters.bathrooms!);

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    default:
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return result;
}
