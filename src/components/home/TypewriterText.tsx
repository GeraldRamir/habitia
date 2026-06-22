"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  text: string;
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
}

export function TypewriterText({
  text,
  className,
  typingSpeed = 65,
  deletingSpeed = 40,
  pauseMs = 2200,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayed(text);
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed.length < text.length) {
      timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && displayed.length === text.length) {
      timeout = setTimeout(() => setIsDeleting(true), pauseMs);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length - 1));
      }, deletingSpeed);
    } else if (isDeleting && displayed.length === 0) {
      timeout = setTimeout(() => setIsDeleting(false), 400);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, text, typingSpeed, deletingSpeed, pauseMs, reducedMotion]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span>{displayed}</span>
      {!reducedMotion && (
        <span
          className="inline-block w-[3px] h-[1em] ml-0.5 bg-accent animate-pulse"
          aria-hidden="true"
        />
      )}
    </span>
  );
}
