"use client";

import { useState } from "react";
import type { Property, PropertyStatus, PropertyTag, PropertyType } from "@/lib/types";
import { AMENITIES, CITIES, PROPERTY_TYPES } from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { createProperty, updateProperty } from "@/lib/storage";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";

interface PropertyFormProps {
  initial?: Property;
  redirectTo?: string;
}

export function PropertyForm({ initial, redirectTo = "/dashboard/propiedades" }: PropertyFormProps) {
  const { user, addToast } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    type: (initial?.type || "casa") as PropertyType,
    status: (initial?.status || "venta") as PropertyStatus,
    price: initial?.price?.toString() || "",
    address: initial?.address || "",
    city: initial?.city || CITIES[0],
    bedrooms: initial?.bedrooms?.toString() || "0",
    bathrooms: initial?.bathrooms?.toString() || "0",
    parking: initial?.parking?.toString() || "0",
    area: initial?.area?.toString() || "",
    amenities: initial?.amenities || [],
    contactPhone: initial?.contactPhone || user?.phone || "",
    contactEmail: initial?.contactEmail || user?.email || "",
    images: initial?.images || [""],
    tags: initial?.tags || [] as PropertyTag[],
    featured: initial?.featured || false,
  });

  const update = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (a: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const toggleTag = (tag: PropertyTag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.title || !form.price || !form.area) {
      addToast("Completa los campos obligatorios", "warning");
      return;
    }

    const images = form.images.filter((i) => i.trim());
    if (images.length === 0) {
      addToast("Agrega al menos una imagen", "warning");
      return;
    }

    setLoading(true);
    const data = {
      sellerId: user.id,
      title: form.title,
      description: form.description,
      type: form.type,
      status: form.status,
      price: Number(form.price),
      address: form.address,
      city: form.city,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      parking: Number(form.parking),
      area: Number(form.area),
      amenities: form.amenities,
      contactPhone: form.contactPhone,
      contactEmail: form.contactEmail,
      images,
      tags: form.tags,
      featured: form.featured,
    };

    if (initial) {
      updateProperty(initial.id, data);
      addToast("Propiedad actualizada");
    } else {
      createProperty(data);
      addToast("Propiedad publicada exitosamente");
    }

    setLoading(false);
    router.push(redirectTo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Título *"
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
        placeholder="Ej: Casa moderna en Piantini"
      />

      <div>
        <label className="text-sm font-medium text-title block mb-1.5">Descripción</label>
        <textarea
          className="input min-h-[120px] resize-y"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Describe la propiedad..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Tipo"
          value={form.type}
          onChange={(e) => update("type", e.target.value)}
          options={PROPERTY_TYPES}
        />
        <Select
          label="Operación"
          value={form.status}
          onChange={(e) => update("status", e.target.value)}
          options={[
            { value: "venta", label: "Venta" },
            { value: "alquiler", label: "Alquiler" },
          ]}
        />
        <Input
          label="Precio (USD) *"
          type="number"
          value={form.price}
          onChange={(e) => update("price", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Dirección"
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
        />
        <Select
          label="Ciudad"
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
          options={CITIES.map((c) => ({ value: c, label: c }))}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Input label="Habitaciones" type="number" min={0} value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} />
        <Input label="Baños" type="number" min={0} value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} />
        <Input label="Parqueos" type="number" min={0} value={form.parking} onChange={(e) => update("parking", e.target.value)} />
        <Input label="Área (m²) *" type="number" min={1} value={form.area} onChange={(e) => update("area", e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium text-title block mb-2">Amenidades</label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAmenity(a)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                form.amenities.includes(a)
                  ? "bg-secondary text-white"
                  : "bg-black/5 dark:bg-white/10 text-muted hover:text-title"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-title block mb-2">Etiquetas</label>
        <div className="flex gap-2">
          {(["destacada", "nueva", "oferta"] as PropertyTag[]).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                form.tags.includes(tag) ? "bg-secondary text-white" : "bg-black/5 dark:bg-white/10 text-muted"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-title block mb-2">Imágenes (URLs)</label>
        {form.images.map((img, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input
              value={img}
              onChange={(e) => {
                const imgs = [...form.images];
                imgs[i] = e.target.value;
                update("images", imgs);
              }}
              placeholder="https://images.unsplash.com/..."
            />
            {form.images.length > 1 && (
              <button
                type="button"
                onClick={() => update("images", form.images.filter((_, j) => j !== i))}
                className="p-2 text-red-500"
              >
                <X size={18} />
              </button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => update("images", [...form.images, ""])}
        >
          <Plus size={16} />
          Agregar imagen
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Teléfono de contacto" value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} />
        <Input label="Email de contacto" type="email" value={form.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => update("featured", e.target.checked)}
          className="w-4 h-4 rounded accent-secondary"
        />
        <span className="text-sm text-title">Marcar como destacada</span>
      </label>

      <Button type="submit" disabled={loading} className="w-full md:w-auto">
        {loading ? "Guardando..." : initial ? "Actualizar propiedad" : "Publicar propiedad"}
      </Button>
    </form>
  );
}
