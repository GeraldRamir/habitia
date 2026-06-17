import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number, status?: "venta" | "alquiler") {
  const formatted = new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
  return status === "alquiler" ? `${formatted}/mes` : formatted;
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-DO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string) {
  return /^[\d\s\-+()]{7,20}$/.test(phone);
}

export function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function propertyTypeLabel(type: string) {
  const labels: Record<string, string> = {
    casa: "Casa",
    apartamento: "Apartamento",
    terreno: "Terreno",
    local: "Local Comercial",
    oficina: "Oficina",
  };
  return labels[type] || type;
}

export function statusLabel(status: string) {
  return status === "venta" ? "Venta" : "Alquiler";
}
