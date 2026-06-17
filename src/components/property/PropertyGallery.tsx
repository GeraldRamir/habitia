"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [current, setCurrent] = useState(0);
  const imgs = images.length > 0 ? images : ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"];

  const prev = () => setCurrent((c) => (c === 0 ? imgs.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === imgs.length - 1 ? 0 : c + 1));

  return (
    <div className="space-y-3">
      <div className="relative h-72 md:h-96 rounded-[20px] overflow-hidden">
        <Image
          src={imgs[current]}
          alt={`${title} - imagen ${current + 1}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 70vw"
        />
        {imgs.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
              {current + 1} / {imgs.length}
            </div>
          </>
        )}
      </div>
      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imgs.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-colors",
                i === current ? "border-secondary" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
