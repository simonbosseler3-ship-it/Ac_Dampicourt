"use client";

import { useEffect, useRef } from "react";

/**
 * Parallaxe légère de l'en-tête : écrit la position de scroll (--sy, en px)
 * sur le bandeau parent. Les calques (hexagones, bandes, titre) se déplacent
 * à des vitesses différentes en CSS. Rien ne se passe si le visiteur a
 * demandé moins d'animations.
 */
export function HeroFx() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hero = ref.current?.parentElement;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = -1;
    const update = () => {
      raf = 0;
      const y = Math.min(window.scrollY, hero.offsetHeight);
      if (y !== last) {
        last = y;
        hero.style.setProperty("--sy", String(Math.round(y)));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <span ref={ref} hidden />;
}
