"use client";
import { useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimateIn({ children, className = "", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.animate = "true";
    let timer: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            el.classList.add("visible");
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, [delay]);

  return (
    <div ref={ref} className={`fade-up ${className}`}>
      {children}
    </div>
  );
}
