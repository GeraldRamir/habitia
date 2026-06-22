"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { CITIES, PROPERTY_TYPES } from "@/lib/constants";
import type { PropertyStatus, PropertyType } from "@/lib/types";

export interface HomeFilters {
  city: string;
  type: PropertyType | "";
  status: PropertyStatus | "";
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
}

export const DEFAULT_HOME_FILTERS: HomeFilters = {
  city: "",
  type: "",
  status: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
};

interface HomeFiltersModalProps {
  open: boolean;
  onClose: () => void;
  filters: HomeFilters;
  onApply: (filters: HomeFilters) => void;
}

export function HomeFiltersModal({
  open,
  onClose,
  filters,
  onApply,
}: HomeFiltersModalProps) {
  const [local, setLocal] = useState(filters);

  useEffect(() => {
    if (open) setLocal(filters);
  }, [open, filters]);

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  const handleClear = () => {
    const cleared = { ...DEFAULT_HOME_FILTERS };
    setLocal(cleared);
    onApply(cleared);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Filtros">
      <div className="space-y-4">
        <div>
          <label htmlFor="filter-city" className="block text-sm font-medium text-title mb-1.5">
            Ciudad
          </label>
          <select
            id="filter-city"
            value={local.city}
            onChange={(e) => setLocal({ ...local, city: e.target.value })}
            className="input w-full"
          >
            <option value="">Todas las ciudades</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-type" className="block text-sm font-medium text-title mb-1.5">
            Tipo de propiedad
          </label>
          <select
            id="filter-type"
            value={local.type}
            onChange={(e) =>
              setLocal({ ...local, type: e.target.value as PropertyType | "" })
            }
            className="input w-full"
          >
            <option value="">Cualquier tipo</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-status" className="block text-sm font-medium text-title mb-1.5">
            Operación
          </label>
          <select
            id="filter-status"
            value={local.status}
            onChange={(e) =>
              setLocal({ ...local, status: e.target.value as PropertyStatus | "" })
            }
            className="input w-full"
          >
            <option value="">Venta o alquiler</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="filter-min-price" className="block text-sm font-medium text-title mb-1.5">
              Precio mín.
            </label>
            <input
              id="filter-min-price"
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={local.minPrice}
              onChange={(e) => setLocal({ ...local, minPrice: e.target.value })}
              className="input w-full"
            />
          </div>
          <div>
            <label htmlFor="filter-max-price" className="block text-sm font-medium text-title mb-1.5">
              Precio máx.
            </label>
            <input
              id="filter-max-price"
              type="number"
              inputMode="numeric"
              placeholder="Sin límite"
              value={local.maxPrice}
              onChange={(e) => setLocal({ ...local, maxPrice: e.target.value })}
              className="input w-full"
            />
          </div>
        </div>

        <div>
          <label htmlFor="filter-bedrooms" className="block text-sm font-medium text-title mb-1.5">
            Habitaciones mín.
          </label>
          <select
            id="filter-bedrooms"
            value={local.bedrooms}
            onChange={(e) => setLocal({ ...local, bedrooms: e.target.value })}
            className="input w-full"
          >
            <option value="">Cualquiera</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={String(n)}>
                {n}+
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={handleClear}>
            Limpiar
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Aplicar filtros
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function applyHomeFilters<T extends {
  city: string;
  type: string;
  status: string;
  price: number;
  bedrooms: number;
}>(properties: T[], filters: HomeFilters): T[] {
  return properties.filter((p) => {
    if (filters.city && p.city !== filters.city) return false;
    if (filters.type && p.type !== filters.type) return false;
    if (filters.status && p.status !== filters.status) return false;
    if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
    if (filters.bedrooms && p.bedrooms < Number(filters.bedrooms)) return false;
    return true;
  });
}
