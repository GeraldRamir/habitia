"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Building2, Users, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyCardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { getProperties, getUserById } from "@/lib/storage";
import { CITIES } from "@/lib/constants";
import type { Property } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const router = useRouter();

  useEffect(() => {
    const props = getProperties().filter((p) => p.active);
    setProperties(props);
    setLoading(false);
  }, []);

  const featured = properties.filter((p) => p.featured).slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (city) params.set("city", city);
    router.push(`/propiedades?${params.toString()}`);
  };

  return (
    <div>
      <section className="relative bg-[#0F172A] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Encuentra tu hogar ideal con{" "}
              <span className="text-secondary">InmoConnect</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              La plataforma inmobiliaria más completa de República Dominicana.
              Compra, vende o alquila con confianza.
            </p>

            <form onSubmit={handleSearch} className="card p-4 flex flex-col md:flex-row gap-3 max-w-2xl mx-auto !bg-white">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar propiedades..."
                  className="input !pl-10 !border-0 !bg-gray-50 text-title"
                />
              </div>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input !border-0 !bg-gray-50 text-title md:w-48"
              >
                <option value="">Todas las ciudades</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <Button type="submit" className="md:px-8">Buscar</Button>
            </form>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Building2, title: "Miles de propiedades", desc: "Casas, apartamentos, terrenos y más" },
            { icon: Users, title: "Vendedores verificados", desc: "Confianza y transparencia garantizada" },
            { icon: Shield, title: "Transacciones seguras", desc: "Proceso simple y protegido" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card text-center p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon size={24} className="text-secondary" />
              </div>
              <h3 className="font-semibold text-title mb-2">{item.title}</h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-title">Propiedades destacadas</h2>
            <p className="text-muted mt-1">Las mejores opciones seleccionadas para ti</p>
          </div>
          <Link href="/propiedades">
            <Button variant="outline">Ver todas</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((property) => {
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
      </section>

      <section className="bg-secondary/5 py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold text-title mb-4">¿Tienes una propiedad para vender?</h2>
          <p className="text-muted mb-6">
            Publica gratis y llega a miles de compradores potenciales en toda la República Dominicana.
          </p>
          <Link href="/publicar">
            <Button size="lg">Publicar mi propiedad</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
