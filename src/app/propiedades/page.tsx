"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyFilters, filterProperties } from "@/components/property/PropertyFilters";
import { PropertyCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { getProperties, getUserById } from "@/lib/storage";
import type { Property, PropertyFilters as Filters } from "@/lib/types";
import { Search } from "lucide-react";

function PropiedadesContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get("search") || undefined,
    city: searchParams.get("city") || undefined,
    sort: "recent",
  });

  useEffect(() => {
    setProperties(getProperties());
    setLoading(false);
  }, []);

  const filtered = filterProperties(properties, filters);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-title">Propiedades</h1>
        <p className="text-muted mt-1">
          {filtered.length} {filtered.length === 1 ? "propiedad encontrada" : "propiedades encontradas"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <PropertyFilters
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters({ sort: "recent" })}
          />
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Search size={32} />}
              title="No se encontraron propiedades"
              description="Intenta ajustar los filtros de búsqueda"
              action={{ label: "Ver todas", href: "/propiedades" }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((property) => {
                const seller = getUserById(property.sellerId);
                return (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    showSeller
                    sellerVerified={seller?.verified}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PropiedadesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    }>
      <PropiedadesContent />
    </Suspense>
  );
}
