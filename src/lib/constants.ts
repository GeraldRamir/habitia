import type { PropertyType } from "./types";

export const COLORS = {
  primary: "#0d1b2a",
  secondary: "#415a77",
  accent: "#778da9",
  background: "#e0e1dd",
  card: "#ffffff",
  dark: "#1b263b",
  title: "#0d1b2a",
  muted: "#778da9",
};

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "casa", label: "Casa" },
  { value: "apartamento", label: "Apartamento" },
  { value: "terreno", label: "Terreno" },
  { value: "local", label: "Local Comercial" },
  { value: "oficina", label: "Oficina" },
];

export const AMENITIES = [
  "Piscina",
  "Gimnasio",
  "Seguridad 24h",
  "Parqueo",
  "Balcón",
  "Terraza",
  "Jardín",
  "Aire acondicionado",
  "Amueblado",
  "Ascensor",
  "Área de BBQ",
  "Vista al mar",
];

export const CITIES = [
  "Santo Domingo",
  "Santiago",
  "Punta Cana",
  "La Romana",
  "Puerto Plata",
  "Bávaro",
  "San Pedro de Macorís",
  "La Vega",
];

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/planes", label: "Planes" },
  { href: "/publicar", label: "Publicar" },
  { href: "/favoritos", label: "Favoritos" },
  { href: "/contacto", label: "Contacto" },
];

export const SELLER_SIDEBAR = [
  { href: "/dashboard", label: "Panel Principal", icon: "LayoutDashboard" },
  { href: "/dashboard/propiedades", label: "Mis Propiedades", icon: "Building2" },
  { href: "/dashboard/publicar", label: "Publicar Propiedad", icon: "PlusCircle" },
  { href: "/dashboard/estadisticas", label: "Estadísticas", icon: "BarChart3" },
  { href: "/dashboard/mensajes", label: "Mensajes", icon: "MessageCircle" },
  { href: "/dashboard/configuracion", label: "Configuración", icon: "Settings" },
];

export const ADMIN_SIDEBAR = [
  { href: "/admin", label: "Panel Admin", icon: "Shield" },
  { href: "/admin/usuarios", label: "Usuarios", icon: "Users" },
  { href: "/admin/propiedades", label: "Propiedades", icon: "Building2" },
  { href: "/admin/reportes", label: "Reportes", icon: "Flag" },
];
