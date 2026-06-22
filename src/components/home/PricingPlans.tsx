"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, CheckSquare } from "lucide-react";
import {
  PUBLISHING_PLANS,
  getDisplayPrice,
  type PlanId,
  type PublishingPlan,
} from "@/lib/plans";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { Modal } from "@/components/ui/Modal";

interface PricingPlansProps {
  id?: string;
  compact?: boolean;
  showHeader?: boolean;
}

function BillingToggle({
  billing,
  onChange,
}: {
  billing: "monthly" | "yearly";
  onChange: (v: "monthly" | "yearly") => void;
}) {
  return (
    <div
      className="inline-flex items-center p-1 rounded-full bg-[#778da9]/20 border border-[#778da9]/30"
      role="group"
      aria-label="Tipo de facturación"
    >
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={cn(
          "px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300",
          billing === "monthly"
            ? "bg-[#1b263b] text-[#e0e1dd] shadow-sm"
            : "text-[#415a77] hover:text-[#0d1b2a]"
        )}
      >
        Mensual
      </button>
      <button
        type="button"
        onClick={() => onChange("yearly")}
        className={cn(
          "px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300",
          billing === "yearly"
            ? "bg-[#1b263b] text-[#e0e1dd] shadow-sm"
            : "text-[#415a77] hover:text-[#0d1b2a]"
        )}
      >
        Anual
        <span className="ml-1.5 text-[10px] font-semibold text-[#10B981]">-17%</span>
      </button>
    </div>
  );
}

function PlanCard({
  plan,
  billing,
  featured,
  onDetails,
  ctaHref,
}: {
  plan: PublishingPlan;
  billing: "monthly" | "yearly";
  featured: boolean;
  onDetails: () => void;
  ctaHref: string;
}) {
  const { amount, suffix } = getDisplayPrice(plan, billing);
  const Icon = plan.icon;

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-2xl p-6 md:p-7 min-h-[520px]",
        "shadow-[0_4px_24px_rgba(13,27,42,0.08)] transition-[box-shadow,transform] duration-300",
        featured
          ? "bg-[#1b263b] text-[#e0e1dd] overflow-hidden scale-[1.02] z-10"
          : "bg-card text-title border border-[#778da9]/25 hover:shadow-[0_8px_32px_rgba(13,27,42,0.12)] hover:-translate-y-1"
      )}
    >
      {featured && (
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e0e1dd' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      )}

      <div className="relative flex-1 flex flex-col">
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center mb-5",
            featured ? "bg-[#415a77]/50" : "bg-[#e0e1dd]"
          )}
        >
          <Icon
            size={18}
            className={featured ? "text-[#e0e1dd]" : "text-[#415a77]"}
            aria-hidden="true"
          />
        </div>

        <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
        <p
          className={cn(
            "text-sm mt-1 mb-6",
            featured ? "text-[#778da9]" : "text-muted"
          )}
        >
          {plan.tagline}
        </p>

        <div className="mb-6">
          <p className="flex items-baseline gap-1 flex-wrap">
            <span className="text-3xl md:text-[2rem] font-bold tabular-nums leading-none">
              {amount}
            </span>
            {suffix && (
              <span
                className={cn(
                  "text-sm font-medium",
                  featured ? "text-[#778da9]" : "text-muted"
                )}
              >
                {suffix}
              </span>
            )}
          </p>
        </div>

        <ul className="space-y-3 mb-6 flex-1">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <Check
                size={16}
                className={cn(
                  "shrink-0 mt-0.5",
                  featured ? "text-[#e0e1dd]" : "text-[#415a77]"
                )}
                aria-hidden="true"
              />
              <span className={featured ? "text-[#e0e1dd]/95" : "text-[#1b263b]"}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onDetails}
          className={cn(
            "text-sm font-medium text-center mb-4 hover:underline underline-offset-4 transition-opacity",
            featured ? "text-[#778da9] hover:text-[#e0e1dd]" : "text-[#415a77]"
          )}
        >
          Ver más detalles
        </button>

        <Link
          href={ctaHref}
          className={cn(
            "block w-full text-center py-3.5 rounded-xl text-sm font-semibold transition-colors duration-300",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#415a77] focus-visible:ring-offset-2",
            featured
              ? "bg-[#e0e1dd] text-[#0d1b2a] hover:bg-white"
              : "bg-[#415a77] text-white hover:bg-[#1b263b]"
          )}
        >
          Seleccionar plan
        </Link>
      </div>
    </article>
  );
}

export function PricingPlans({
  id = "planes",
  compact = false,
  showHeader = true,
}: PricingPlansProps) {
  const { user } = useApp();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [detailsPlan, setDetailsPlan] = useState<PublishingPlan | null>(null);

  const ctaHref = (planId: PlanId) => {
    if (planId === "empresa" && !user) return "/contacto?plan=empresa";
    if (user?.role === "seller") return "/dashboard/publicar";
    if (user) return "/publicar";
    return `/registro?role=seller&plan=${planId}&billing=${billing}`;
  };

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 bg-[#e0e1dd]",
        compact ? "py-12" : "py-16 md:py-24"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-[#0d1b2a] text-balance tracking-tight mb-3">
              Elige el plan perfecto para tu negocio
            </h2>
            <p className="text-[#415a77] text-sm md:text-base text-pretty mb-8">
              Publica propiedades con habitia. Los compradores pueden explorar sin
              registrarse; tú eliges el plan según tu volumen de publicaciones.
            </p>
            <BillingToggle billing={billing} onChange={setBilling} />
          </div>
        )}

        {!showHeader && (
          <div className="flex justify-center mb-10">
            <BillingToggle billing={billing} onChange={setBilling} />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-4 items-stretch mt-10 md:mt-12">
          {PUBLISHING_PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billing={billing}
              featured={!!plan.popular}
              onDetails={() => setDetailsPlan(plan)}
              ctaHref={ctaHref(plan.id)}
            />
          ))}
        </div>

        <p className="text-center text-xs text-[#778da9] mt-10 max-w-lg mx-auto">
          Plan anual con 2 meses de descuento. Sin compromiso en el plan Inicio.
        </p>
      </div>

      <Modal
        open={!!detailsPlan}
        onClose={() => setDetailsPlan(null)}
        title={detailsPlan ? `Plan ${detailsPlan.name}` : ""}
        className="max-w-md"
      >
        {detailsPlan && (
          <div className="space-y-4">
            <p className="text-sm text-muted">{detailsPlan.tagline}</p>
            <ul className="space-y-2">
              {[...detailsPlan.features, ...detailsPlan.details].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-title">
                  <CheckSquare size={16} className="text-[#415a77] shrink-0 mt-0.5" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={ctaHref(detailsPlan.id)}
              onClick={() => setDetailsPlan(null)}
              className="block w-full text-center py-3 rounded-xl bg-[#415a77] text-white text-sm font-semibold hover:bg-[#1b263b] transition-colors"
            >
              Seleccionar plan
            </Link>
          </div>
        )}
      </Modal>
    </section>
  );
}
