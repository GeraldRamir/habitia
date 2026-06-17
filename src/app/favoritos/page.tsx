"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { getFavorites, getProperties, getUserById } from "@/lib/storage";
import type { Property } from "@/lib/types";

export default function FavoritosPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favIds = getFavorites();
    const all = getProperties();
    setProperties(all.filter((p) => favIds.includes(p.id)));
    setLoading(false);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-title mb-2">Mis favoritos</h1>
      <p className="text-muted mb-8">Propiedades que has guardado</p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <EmptyState
          icon={<Heart size={32} />}
          title="No tienes favoritos"
          description="Explora propiedades y guarda las que te interesen"
          action={{ label: "Explorar propiedades", href: "/propiedades" }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
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
  );
}
