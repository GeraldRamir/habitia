import type { LucideIcon } from "lucide-react";
import type { PropertyType } from "./types";
import {
  Home,
  Building2,
  TreePine,
  Store,
  Waves,
  Crown,
  Key,
  Tag,
  Sparkles,
} from "lucide-react";

export type HomeCategoryId =
  | "all"
  | PropertyType
  | "frente-mar"
  | "lujo"
  | "venta"
  | "alquiler"
  | "destacadas";

export interface HomeCategory {
  id: HomeCategoryId;
  label: string;
  icon: LucideIcon;
}

export const HOME_CATEGORIES: HomeCategory[] = [
  { id: "all", label: "Todas", icon: Sparkles },
  { id: "casa", label: "Casas", icon: Home },
  { id: "apartamento", label: "Apartamentos", icon: Building2 },
  { id: "terreno", label: "Terrenos", icon: TreePine },
  { id: "local", label: "Locales", icon: Store },
  { id: "frente-mar", label: "Frente al mar", icon: Waves },
  { id: "lujo", label: "Lujo", icon: Crown },
  { id: "venta", label: "En venta", icon: Tag },
  { id: "alquiler", label: "En alquiler", icon: Key },
  { id: "destacadas", label: "Destacadas", icon: Sparkles },
];
