"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { CITIES, PROPERTY_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface HomeSearchBarProps {
  className?: string;
  compact?: boolean;
}

export function HomeSearchBar({ className, compact = false }: HomeSearchBarProps) {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (status) params.set("status", status);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/propiedades?${params.toString()}`);
  };

  const fieldClass = (field: string) =>
    cn(
      "flex-1 min-w-0 px-5 py-3 md:py-4 cursor-pointer rounded-full transition-colors",
      "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
      activeField === field && "bg-black/[0.04] dark:bg-white/[0.06]",
      "focus-within:bg-black/[0.04] dark:focus-within:bg-white/[0.06]"
    );

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => router.push("/propiedades")}
        className={cn(
          "flex items-center gap-3 w-full max-w-sm mx-auto px-5 py-3",
          "rounded-full border border-black/10 dark:border-white/10 shadow-md",
          "bg-card text-sm text-muted hover:shadow-lg transition-shadow",
          className
        )}
      >
        <Search size={16} aria-hidden="true" />
        <span className="truncate">Buscar propiedades…</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative bg-card rounded-full border border-black/10 dark:border-white/10",
        "shadow-[0_6px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)]",
        "transition-[box-shadow] duration-300 max-w-5xl mx-auto",
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center md:divide-x md:divide-black/10 dark:md:divide-white/10">
        <div
          className={fieldClass("where")}
          onClick={() => setActiveField("where")}
        >
          <label htmlFor="home-search-where" className="block text-xs font-semibold text-title">
            Dónde
          </label>
          <input
            id="home-search-where"
            name="search"
            type="text"
            autoComplete="off"
            placeholder="Buscar ciudad o zona…"
            value={search || city}
            onChange={(e) => {
              setSearch(e.target.value);
              setCity("");
            }}
            onFocus={() => setActiveField("where")}
            onBlur={() => setActiveField(null)}
            className="w-full bg-transparent text-sm text-muted placeholder:text-muted/70 outline-none focus-visible:ring-0 mt-0.5"
          />
        </div>

        <div
          className={cn(fieldClass("type"), "hidden sm:block")}
          onClick={() => setActiveField("type")}
        >
          <label htmlFor="home-search-type" className="block text-xs font-semibold text-title">
            Tipo
          </label>
          <select
            id="home-search-type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            onFocus={() => setActiveField("type")}
            onBlur={() => setActiveField(null)}
            className="w-full bg-transparent text-sm text-muted outline-none cursor-pointer mt-0.5 appearance-none"
          >
            <option value="">Cualquier tipo</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div
          className={cn(fieldClass("status"), "hidden lg:block")}
          onClick={() => setActiveField("status")}
        >
          <label htmlFor="home-search-status" className="block text-xs font-semibold text-title">
            Operación
          </label>
          <select
            id="home-search-status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            onFocus={() => setActiveField("status")}
            onBlur={() => setActiveField(null)}
            className="w-full bg-transparent text-sm text-muted outline-none cursor-pointer mt-0.5 appearance-none"
          >
            <option value="">Venta o alquiler</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>

        <div
          className={cn(fieldClass("price"), "hidden xl:block")}
          onClick={() => setActiveField("price")}
        >
          <span className="block text-xs font-semibold text-title">Precio</span>
          <div className="flex items-center gap-1 mt-0.5">
            <input
              id="home-search-min-price"
              name="minPrice"
              type="number"
              inputMode="numeric"
              placeholder="Mín."
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onFocus={() => setActiveField("price")}
              onBlur={() => setActiveField(null)}
              className="w-20 bg-transparent text-sm text-muted placeholder:text-muted/70 outline-none"
              aria-label="Precio mínimo"
            />
            <span className="text-muted text-xs">–</span>
            <input
              id="home-search-max-price"
              name="maxPrice"
              type="number"
              inputMode="numeric"
              placeholder="Máx."
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onFocus={() => setActiveField("price")}
              onBlur={() => setActiveField(null)}
              className="w-20 bg-transparent text-sm text-muted placeholder:text-muted/70 outline-none"
              aria-label="Precio máximo"
            />
          </div>
        </div>

        <div className="p-2 md:pl-0 flex items-center justify-end md:justify-center shrink-0">
          <button
            type="submit"
            className={cn(
              "flex items-center justify-center gap-2 rounded-full bg-secondary text-white",
              "hover:bg-[#1b263b] transition-colors duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
              "w-full md:w-12 md:h-12 h-11 px-6 md:px-0 font-semibold md:font-normal text-sm"
            )}
            aria-label="Buscar propiedades"
          >
            <Search size={18} aria-hidden="true" />
            <span className="md:hidden">Buscar</span>
          </button>
        </div>
      </div>

      {/* Mobile quick filters */}
      <div className="sm:hidden px-4 pb-3 pt-1 flex gap-2 overflow-x-auto">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-full border border-black/10 bg-background text-title shrink-0"
          aria-label="Ciudad"
        >
          <option value="">Ciudad</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-full border border-black/10 bg-background text-title shrink-0"
          aria-label="Tipo de propiedad"
        >
          <option value="">Tipo</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-full border border-black/10 bg-background text-title shrink-0"
          aria-label="Operación"
        >
          <option value="">Operación</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>
      </div>
    </form>
  );
}
