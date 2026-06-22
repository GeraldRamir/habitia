"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import type { Property } from "@/lib/types";
import {
  formatPrice,
  propertyTypeLabel,
  statusLabel,
  cn,
} from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { toggleFavorite, isFavorite } from "@/lib/storage";
import { getPropertyReviews } from "@/lib/storage";

interface HomePropertyCardProps {
  property: Property;
  showTotalPrice?: boolean;
}

function getAverageRating(propertyId: string): number | null {
  const reviews = getPropertyReviews(propertyId);
  if (reviews.length === 0) return null;
  const avg =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return Math.round(avg * 10) / 10;
}

export function HomePropertyCard({ property, showTotalPrice = false }: HomePropertyCardProps) {
  const { addToast } = useApp();
  const [fav, setFav] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [rating, setRating] = useState<number | null>(null);

  const images =
    property.images.length > 0
      ? property.images
      : [
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
        ];

  useEffect(() => {
    setFav(isFavorite(property.id));
    setRating(getAverageRating(property.id));
  }, [property.id]);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleFavorite(property.id);
    setFav(added);
    addToast(added ? "Guardado en favoritos" : "Eliminado de favoritos");
  };

  const subtitle = [
    propertyTypeLabel(property.type),
    property.bedrooms > 0 ? `${property.bedrooms} hab.` : null,
    statusLabel(property.status),
  ]
    .filter(Boolean)
    .join(" · ");

  const isGuestFavorite =
    property.featured || property.tags.includes("destacada");

  const cycleImage = useCallback(
    (e: React.MouseEvent, dir: 1 | -1) => {
      e.preventDefault();
      e.stopPropagation();
      setImageIndex((i) => {
        const next = i + dir;
        if (next < 0) return images.length - 1;
        if (next >= images.length) return 0;
        return next;
      });
    },
    [images.length]
  );

  const displayPrice =
    showTotalPrice && property.status === "venta"
      ? Math.round(property.price * 1.05)
      : property.price;

  return (
    <Link href={`/propiedades/${property.id}`} className="group block">
      <article>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-3">
          <Image
            src={images[imageIndex]}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {isGuestFavorite && (
            <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold bg-white text-title rounded-full shadow-sm border border-black/5">
              Favorito entre compradores
            </span>
          )}

          <button
            type="button"
            onClick={handleFavorite}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:scale-110 transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={fav ? "Quitar de favoritos" : "Guardar en favoritos"}
          >
            <Heart
              size={22}
              className={cn(
                "drop-shadow-md transition-colors",
                fav ? "fill-[#FF385C] text-[#FF385C]" : "fill-black/40 text-white stroke-white stroke-[1.5px]"
              )}
            />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => cycleImage(e, -1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex text-title text-sm font-bold shadow"
                aria-label="Imagen anterior"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => cycleImage(e, 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex text-title text-sm font-bold shadow"
                aria-label="Imagen siguiente"
              >
                ›
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-colors",
                      i === imageIndex ? "bg-white" : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="space-y-0.5 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-title truncate text-[15px]">
              {property.city}, {property.address.split(",")[0]}
            </h3>
            {rating !== null && (
              <span className="flex items-center gap-0.5 text-sm shrink-0 tabular-nums">
                <Star size={14} className="fill-title text-title" aria-hidden="true" />
                {rating}
              </span>
            )}
          </div>
          <p className="text-sm text-muted truncate">{subtitle}</p>
          <p className="text-sm text-muted truncate">{property.title}</p>
          <p className="pt-0.5">
            <span className="font-semibold text-title tabular-nums">
              {formatPrice(displayPrice, property.status)}
            </span>
            {showTotalPrice && property.status === "venta" && (
              <span className="text-xs text-muted ml-1">total est.</span>
            )}
          </p>
        </div>
      </article>
    </Link>
  );
}

export function HomePropertyCardSkeleton() {
  return (
    <div>
      <div className="skeleton aspect-[4/3] rounded-xl mb-3" />
      <div className="space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3.5 w-1/2" />
        <div className="skeleton h-4 w-1/3 mt-1" />
      </div>
    </div>
  );
}
