"use client";

import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Car, Maximize, Heart, GitCompare, MapPin, BadgeCheck } from "lucide-react";
import type { Property } from "@/lib/types";
import { formatPrice, propertyTypeLabel, statusLabel, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { useApp } from "@/context/AppContext";
import { toggleFavorite, isFavorite, toggleCompare, getCompareList } from "@/lib/storage";
import { useState, useEffect } from "react";

interface PropertyCardProps {
  property: Property;
  showSeller?: boolean;
  sellerVerified?: boolean;
}

export function PropertyCard({ property, showSeller, sellerVerified }: PropertyCardProps) {
  const { addToast, user } = useApp();
  const [fav, setFav] = useState(false);
  const [inCompare, setInCompare] = useState(false);

  useEffect(() => {
    setFav(isFavorite(property.id));
    setInCompare(getCompareList().includes(property.id));
  }, [property.id]);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleFavorite(property.id);
    setFav(added);
    addToast(added ? "Agregado a favoritos" : "Eliminado de favoritos");
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleCompare(property.id);
    if (added) {
      setInCompare(true);
      addToast("Agregado al comparador");
    } else {
      setInCompare(false);
      addToast("Eliminado del comparador");
    }
    if (!added && !getCompareList().includes(property.id)) {
      addToast("Máximo 3 propiedades en el comparador", "warning");
    }
  };

  return (
    <Link href={`/propiedades/${property.id}`} className="block group">
      <article className="card overflow-hidden hover:-translate-y-1 transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={property.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            {property.tags.map((tag) => (
              <Badge key={tag} tag={tag} />
            ))}
          </div>
          <div className="absolute top-3 right-3 flex gap-1.5">
            <button
              onClick={handleCompare}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors",
                inCompare ? "bg-secondary text-white" : "bg-white/90 text-muted hover:text-secondary"
              )}
            >
              <GitCompare size={16} />
            </button>
            <button
              onClick={handleFavorite}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors",
                fav ? "bg-red-500 text-white" : "bg-white/90 text-muted hover:text-red-500"
              )}
            >
              <Heart size={16} fill={fav ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#0F172A]/80 text-white backdrop-blur-sm">
              {statusLabel(property.status)}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-xs text-muted">{propertyTypeLabel(property.type)}</p>
            {showSeller && sellerVerified && (
              <span className="flex items-center gap-0.5 text-xs text-success">
                <BadgeCheck size={14} />
                Verificado
              </span>
            )}
          </div>
          <h3 className="font-semibold text-title line-clamp-2 mb-2 group-hover:text-secondary transition-colors">
            {property.title}
          </h3>
          <p className="flex items-center gap-1 text-sm text-muted mb-3">
            <MapPin size={14} />
            {property.city}
          </p>
          <p className="text-xl font-bold text-secondary mb-3">
            {formatPrice(property.price, property.status)}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bed size={14} />
                {property.bedrooms}
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bath size={14} />
                {property.bathrooms}
              </span>
            )}
            {property.parking > 0 && (
              <span className="flex items-center gap-1">
                <Car size={14} />
                {property.parking}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Maximize size={14} />
              {property.area} m²
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
