import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "btn btn-primary",
    secondary: "btn btn-secondary",
    outline: "btn btn-outline",
    ghost: "btn bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-title",
    danger: "btn bg-red-500 text-white hover:bg-red-600",
  };
  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "",
    lg: "text-base px-6 py-3",
  };
  return (
    <button
      className={cn(variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
