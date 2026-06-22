import { PricingPlans } from "@/components/home/PricingPlans";

export const metadata = {
  title: "Planes",
  description:
    "Planes para publicar propiedades en habitia. Desde gratis hasta planes empresa para inmobiliarias.",
};

export default function PlanesPage() {
  return (
    <div className="bg-[#e0e1dd] min-h-screen">
      <PricingPlans showHeader />
    </div>
  );
}
