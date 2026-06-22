import {
  Zap,
  Rocket,
  Crown,
  Building2,
  type LucideIcon,
} from "lucide-react";

export type PlanId = "inicio" | "profesional" | "premium" | "empresa";

export interface PublishingPlan {
  id: PlanId;
  name: string;
  tagline: string;
  price: number;
  yearlyPrice: number | null;
  negotiable?: boolean;
  period: "mes";
  propertiesLimit: number | null;
  photosPerProperty: number | null;
  durationDays: number;
  popular?: boolean;
  icon: LucideIcon;
  features: string[];
  details: string[];
}

export const PUBLISHING_PLANS: PublishingPlan[] = [
  {
    id: "inicio",
    name: "Inicio",
    tagline: "Ideal para empezar a publicar",
    price: 0,
    yearlyPrice: 0,
    period: "mes",
    propertiesLimit: 1,
    photosPerProperty: 5,
    durationDays: 30,
    icon: Zap,
    features: [
      "1 propiedad activa",
      "Hasta 5 fotos por publicación",
      "Visible en búsquedas",
      "Mensajería con compradores",
    ],
    details: [
      "Publicación activa por 30 días",
      "Renovación manual al vencer",
      "Sin estadísticas avanzadas",
      "Ideal para probar habitia sin costo",
    ],
  },
  {
    id: "profesional",
    name: "Profesional",
    tagline: "Para vendedores en crecimiento",
    price: 29,
    yearlyPrice: 290,
    period: "mes",
    propertiesLimit: 5,
    photosPerProperty: 15,
    durationDays: 90,
    popular: true,
    icon: Rocket,
    features: [
      "Hasta 5 propiedades activas",
      "Hasta 15 fotos por publicación",
      "Etiqueta «Destacada» incluida",
      "Estadísticas básicas de visitas",
      "Soporte por email",
    ],
    details: [
      "Renovación automática cada 90 días",
      "2 propiedades con badge destacada",
      "Prioridad media en búsquedas",
      "Exportación básica de contactos",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Máxima visibilidad y herramientas",
    price: 79,
    yearlyPrice: 790,
    period: "mes",
    propertiesLimit: 15,
    photosPerProperty: null,
    durationDays: 180,
    icon: Crown,
    features: [
      "Hasta 15 propiedades activas",
      "Fotos ilimitadas",
      "Verificación de vendedor",
      "Todas las etiquetas promocionales",
      "Estadísticas avanzadas",
    ],
    details: [
      "Prioridad alta en resultados",
      "Badge de vendedor verificado",
      "Calculadora de hipoteca en tus listings",
      "Soporte prioritario en horario laboral",
    ],
  },
  {
    id: "empresa",
    name: "Empresa",
    tagline: "Para inmobiliarias y equipos",
    price: 0,
    yearlyPrice: null,
    negotiable: true,
    period: "mes",
    propertiesLimit: null,
    photosPerProperty: null,
    durationDays: 365,
    icon: Building2,
    features: [
      "Propiedades ilimitadas",
      "Hasta 5 cuentas de agente",
      "Panel administrativo de equipo",
      "Reportes y exportación de datos",
      "Soporte dedicado 24/7",
    ],
    details: [
      "Precio según volumen y necesidades",
      "Onboarding personalizado",
      "API e integraciones a medida",
      "Gerente de cuenta asignado",
    ],
  },
];

export function getPlanById(id: string): PublishingPlan | undefined {
  return PUBLISHING_PLANS.find((p) => p.id === id);
}

export function formatPlanPrice(price: number): string {
  if (price === 0) return "$0";
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getDisplayPrice(
  plan: PublishingPlan,
  billing: "monthly" | "yearly"
): { amount: string; suffix: string } {
  if (plan.negotiable) {
    return { amount: "Negociable", suffix: "" };
  }
  if (billing === "yearly" && plan.yearlyPrice !== null) {
    if (plan.yearlyPrice === 0) {
      return { amount: "Gratis", suffix: "" };
    }
    return {
      amount: formatPlanPrice(plan.yearlyPrice),
      suffix: "/ Año",
    };
  }
  if (plan.price === 0) {
    return { amount: "Gratis", suffix: "" };
  }
  return {
    amount: formatPlanPrice(plan.price),
    suffix: "/ Mes",
  };
}
