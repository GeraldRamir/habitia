"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getProperties } from "@/lib/storage";
import type { Property } from "@/lib/types";
import type { HomeCategoryId } from "@/lib/home-categories";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { CategoryBar } from "@/components/home/CategoryBar";
import { TypewriterText } from "@/components/home/TypewriterText";
import {
  HomePropertyCard,
  HomePropertyCardSkeleton,
} from "@/components/home/HomePropertyCard";
import {
  HomeFiltersModal,
  applyHomeFilters,
  DEFAULT_HOME_FILTERS,
  type HomeFilters,
} from "@/components/home/HomeFiltersModal";
import { PricingPlans } from "@/components/home/PricingPlans";

function filterByCategory(
  properties: Property[],
  category: HomeCategoryId
): Property[] {
  switch (category) {
    case "all":
      return properties;
    case "casa":
    case "apartamento":
    case "terreno":
    case "local":
    case "oficina":
      return properties.filter((p) => p.type === category);
    case "frente-mar":
      return properties.filter((p) =>
        p.amenities.some((a) => a.toLowerCase().includes("mar"))
      );
    case "lujo":
      return properties.filter((p) => p.price >= 300000);
    case "venta":
      return properties.filter((p) => p.status === "venta");
    case "alquiler":
      return properties.filter((p) => p.status === "alquiler");
    case "destacadas":
      return properties.filter((p) => p.featured);
    default:
      return properties;
  }
}

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<HomeCategoryId>("all");
  const [showTotalPrice, setShowTotalPrice] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<HomeFilters>(DEFAULT_HOME_FILTERS);

  useEffect(() => {
    setProperties(getProperties().filter((p) => p.active));
    setLoading(false);
  }, []);

  const filtered = useMemo(() => {
    const byCategory = filterByCategory(properties, category);
    return applyHomeFilters(byCategory, filters);
  }, [properties, category, filters]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-background min-h-screen">
      <section className="pt-8 pb-2 md:pt-12 md:pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-8 md:mb-10">
          <h1 className="text-2xl md:text-[36px] font-semibold text-title text-balance tracking-tight mb-3 min-h-[1.4em]">
            <TypewriterText text="Encuentra la propiedad perfecta para ti" />
          </h1>
          <p className="text-muted text-sm md:text-base max-w-lg mx-auto text-pretty">
            Compra, vende o alquila propiedades de forma rápida y segura en
            República Dominicana.
          </p>
        </div>
        <HomeSearchBar />
      </section>

      <CategoryBar
        active={category}
        onChange={setCategory}
        showTotalPrice={showTotalPrice}
        onToggleTotalPrice={() => setShowTotalPrice((v) => !v)}
        onOpenFilters={() => setFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      <HomeFiltersModal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onApply={setFilters}
      />

      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10"
      >
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <HomePropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg font-medium text-title mb-2">
              No hay propiedades con estos criterios
            </p>
            <p className="text-muted text-sm mb-6">
              Prueba otra categoría o ajusta los filtros.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setCategory("all");
                  setFilters(DEFAULT_HOME_FILTERS);
                }}
                className="text-sm font-semibold text-title underline underline-offset-4 hover:text-secondary transition-colors"
              >
                Ver todas las propiedades
              </button>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="text-sm font-semibold text-secondary underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                Abrir filtros
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {filtered.map((property) => (
              <HomePropertyCard
                key={property.id}
                property={property}
                showTotalPrice={showTotalPrice}
              />
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/propiedades"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-border text-sm font-semibold text-title hover:shadow-md hover:bg-card transition-[box-shadow,background-color] duration-300"
            >
              Mostrar más propiedades
            </Link>
          </div>
        )}
      </main>

      <PricingPlans />
    </div>
  );
}
