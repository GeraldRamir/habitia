"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bed, Bath, Car, Maximize, MapPin, Heart, Share2, Phone, Mail,
  BadgeCheck, Flag, GitCompare,
} from "lucide-react";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { MortgageCalculator } from "@/components/property/MortgageCalculator";
import { ReviewsSection } from "@/components/property/ReviewsSection";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/Modal";
import {
  getPropertyById, getUserById, getPropertyReviews, toggleFavorite,
  isFavorite, toggleCompare, getOrCreateConversation, sendMessage, addReport,
} from "@/lib/storage";
import { formatPrice, propertyTypeLabel, statusLabel, getInitials } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import type { Property, Review } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, addToast } = useApp();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [fav, setFav] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    const p = getPropertyById(id);
    if (!p || !p.active) {
      setNotFound(true);
      return;
    }
    setProperty(p);
    setReviews(getPropertyReviews(id));
    setFav(isFavorite(id));
  }, [id]);

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <h2 className="text-2xl font-semibold text-title mb-2">Propiedad no encontrada</h2>
        <p className="text-muted mb-8">Esta propiedad no existe o no está disponible.</p>
        <Link href="/propiedades"><Button>Ver propiedades</Button></Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="skeleton h-96 w-full rounded-[20px] mb-6" />
        <div className="skeleton h-8 w-1/2" />
      </div>
    );
  }

  const seller = getUserById(property.sellerId);

  const handleFavorite = () => {
    const added = toggleFavorite(property.id);
    setFav(added);
    addToast(added ? "Agregado a favoritos" : "Eliminado de favoritos");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      addToast("Enlace copiado al portapapeles");
    } catch {
      addToast("No se pudo copiar el enlace", "error");
    }
  };

  const handleContact = () => {
    if (!user) {
      addToast("Inicia sesión para contactar al vendedor", "warning");
      router.push("/login");
      return;
    }
    if (user.id === property.sellerId) {
      addToast("No puedes contactarte a ti mismo", "warning");
      return;
    }
    const conv = getOrCreateConversation(property.id, user.id, property.sellerId);
    sendMessage(conv.id, user.id, `Hola, estoy interesado en: ${property.title}`);
    addToast("Mensaje enviado al vendedor");
    router.push(user.role === "seller" ? "/dashboard/mensajes" : "/mensajes");
  };

  const handleReport = () => {
    if (!user) {
      addToast("Inicia sesión para reportar", "warning");
      return;
    }
    addReport({
      type: "property",
      targetId: property.id,
      reporterId: user.id,
      reason: "Contenido inapropiado o información incorrecta",
    });
    addToast("Reporte enviado. Lo revisaremos pronto.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <PropertyGallery images={property.images} title={property.title} />

          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {property.tags.map((tag) => (
                <Badge key={tag} tag={tag} />
              ))}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/5 dark:bg-white/10 text-muted">
                {propertyTypeLabel(property.type)}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                {statusLabel(property.status)}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-title mb-2">{property.title}</h1>
            <p className="flex items-center gap-1 text-muted mb-4">
              <MapPin size={16} />
              {property.address}, {property.city}
            </p>
            <p className="text-3xl font-bold text-secondary mb-6">
              {formatPrice(property.price, property.status)}
            </p>

            <div className="flex flex-wrap gap-6 mb-6">
              {property.bedrooms > 0 && (
                <span className="flex items-center gap-2 text-muted">
                  <Bed size={20} className="text-secondary" />
                  {property.bedrooms} hab.
                </span>
              )}
              {property.bathrooms > 0 && (
                <span className="flex items-center gap-2 text-muted">
                  <Bath size={20} className="text-secondary" />
                  {property.bathrooms} baños
                </span>
              )}
              {property.parking > 0 && (
                <span className="flex items-center gap-2 text-muted">
                  <Car size={20} className="text-secondary" />
                  {property.parking} parqueos
                </span>
              )}
              <span className="flex items-center gap-2 text-muted">
                <Maximize size={20} className="text-secondary" />
                {property.area} m²
              </span>
            </div>

            <Card>
              <h2 className="font-semibold text-title mb-3">Descripción</h2>
              <p className="text-muted leading-relaxed">{property.description}</p>
            </Card>

            {property.amenities.length > 0 && (
              <Card className="mt-4">
                <h2 className="font-semibold text-title mb-3">Amenidades</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <span key={a} className="px-3 py-1.5 rounded-full text-sm bg-secondary/10 text-secondary">
                      {a}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            <Card className="mt-4">
              <h2 className="font-semibold text-title mb-3">Ubicación</h2>
              <div className="h-48 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <div className="text-center text-muted">
                  <MapPin size={32} className="mx-auto mb-2 text-secondary" />
                  <p>{property.address}</p>
                  <p className="text-sm">{property.city}, República Dominicana</p>
                </div>
              </div>
            </Card>

            <div className="mt-8">
              <ReviewsSection
                propertyId={property.id}
                reviews={reviews}
                onReviewAdded={() => setReviews(getPropertyReviews(property.id))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex gap-3 mb-4">
              {seller?.avatar ? (
                <Image src={seller.avatar} alt="" width={48} height={48} className="rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white font-semibold">
                  {seller ? getInitials(seller.firstName, seller.lastName) : "?"}
                </div>
              )}
              <div>
                <p className="font-semibold text-title">
                  {seller ? `${seller.firstName} ${seller.lastName}` : "Vendedor"}
                </p>
                {seller?.verified && (
                  <span className="flex items-center gap-1 text-xs text-success">
                    <BadgeCheck size={14} />
                    Vendedor verificado
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <a href={`tel:${property.contactPhone}`} className="flex items-center gap-2 text-sm text-muted hover:text-secondary">
                <Phone size={16} />
                {property.contactPhone}
              </a>
              <a href={`mailto:${property.contactEmail}`} className="flex items-center gap-2 text-sm text-muted hover:text-secondary">
                <Mail size={16} />
                {property.contactEmail}
              </a>
            </div>

            <div className="space-y-2">
              <Button className="w-full" onClick={handleContact}>
                Contactar vendedor
              </Button>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" onClick={handleFavorite}>
                  <Heart size={16} fill={fav ? "currentColor" : "none"} className={fav ? "text-red-500" : ""} />
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const added = toggleCompare(property.id);
                    addToast(added ? "Agregado al comparador" : "Ya está en el comparador o límite alcanzado", added ? "success" : "warning");
                  }}
                >
                  <GitCompare size={16} />
                </Button>
              </div>
              <button
                onClick={() => setReportOpen(true)}
                className="flex items-center gap-1 text-xs text-muted hover:text-red-500 mx-auto mt-2"
              >
                <Flag size={12} />
                Reportar propiedad
              </button>
            </div>
          </Card>

          {property.status === "venta" && (
            <MortgageCalculator price={property.price} />
          )}
        </div>
      </div>

      <ConfirmModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onConfirm={handleReport}
        title="Reportar propiedad"
        message="¿Deseas reportar esta propiedad por contenido inapropiado o información incorrecta?"
        confirmLabel="Reportar"
        danger
      />
    </div>
  );
}
