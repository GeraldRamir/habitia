import { cn } from "@/lib/utils";
import type { PropertyTag } from "@/lib/types";

const tagLabels: Record<PropertyTag, string> = {
  destacada: "Destacada",
  nueva: "Nueva",
  oferta: "Oferta",
};

export function Badge({
  tag,
  children,
  className,
}: {
  tag?: PropertyTag;
  children?: React.ReactNode;
  className?: string;
}) {
  if (tag) {
    return (
      <span className={cn("badge-" + tag, "px-2.5 py-0.5 rounded-full text-xs font-medium", className)}>
        {tagLabels[tag]}
      </span>
    );
  }
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary", className)}>
      {children}
    </span>
  );
}
