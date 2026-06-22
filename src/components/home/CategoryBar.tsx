"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { HOME_CATEGORIES, type HomeCategoryId } from "@/lib/home-categories";
import { cn } from "@/lib/utils";

interface CategoryBarProps {
  active: HomeCategoryId;
  onChange: (id: HomeCategoryId) => void;
  showTotalPrice?: boolean;
  onToggleTotalPrice?: () => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
}

export function CategoryBar({
  active,
  onChange,
  showTotalPrice = false,
  onToggleTotalPrice,
  onOpenFilters,
  activeFilterCount = 0,
}: CategoryBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  return (
    <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-20 md:top-[88px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-3">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="hidden md:flex shrink-0 w-8 h-8 items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-muted hover:text-title hover:border-black/20 transition-colors"
            aria-label="Categorías anteriores"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>

          <div
            ref={scrollRef}
            className="flex-1 flex gap-6 overflow-x-auto scrollbar-hide py-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {HOME_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = active === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onChange(cat.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 min-w-[64px] shrink-0 pb-2",
                    "border-b-2 transition-colors duration-300",
                    isActive
                      ? "border-title text-title"
                      : "border-transparent text-muted hover:text-title hover:border-black/20"
                  )}
                >
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.25 : 1.75}
                    className="opacity-90"
                    aria-hidden="true"
                  />
                  <span className="text-[11px] font-medium whitespace-nowrap">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenFilters}
              className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-xs font-medium text-title"
            >
              <SlidersHorizontal size={14} aria-hidden="true" />
              Filtros
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-secondary text-white text-[10px] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {onToggleTotalPrice && (
              <button
                type="button"
                onClick={onToggleTotalPrice}
                className={cn(
                  "lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium",
                  showTotalPrice
                    ? "border-secondary bg-secondary/10 text-secondary"
                    : "border-border text-title"
                )}
                aria-pressed={showTotalPrice}
              >
                Precio total
              </button>
            )}

            <button
              type="button"
              onClick={() => scroll("right")}
              className="hidden md:flex shrink-0 w-8 h-8 items-center justify-center rounded-full border border-border text-muted hover:text-title transition-colors"
              aria-label="Más categorías"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0 pl-2 border-l border-border ml-1">
            <button
              type="button"
              onClick={onOpenFilters}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-title hover:shadow-sm transition-shadow"
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filtros
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-secondary text-white text-[10px] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {onToggleTotalPrice && (
              <label className="flex items-center gap-2 text-xs text-muted cursor-pointer select-none whitespace-nowrap">
                <button
                  type="button"
                  role="switch"
                  aria-checked={showTotalPrice}
                  onClick={onToggleTotalPrice}
                  className={cn(
                    "relative w-10 h-6 rounded-full transition-colors duration-300",
                    showTotalPrice ? "bg-title" : "bg-black/15 dark:bg-white/20"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300",
                      showTotalPrice && "translate-x-4"
                    )}
                  />
                </button>
                Precio total
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
