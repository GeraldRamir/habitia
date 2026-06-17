import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-title">
          {label}
        </label>
      )}
      <input id={inputId} className={cn("input", error && "border-red-500", className)} {...props} />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
