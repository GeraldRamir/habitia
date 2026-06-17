import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div className={cn("card p-6", hover && "hover:-translate-y-0.5", className)}>
      {children}
    </div>
  );
}
