"use client";

/**
 * Apparition douce des contenus au scroll, sur TOUTES les pages, sans avoir
 * à modifier chaque composant.
 *
 * - Cible : les cartes des grilles, les sections et les articles dans <main>,
 *   plus tout élément marqué data-reveal.
 * - Un élément déjà visible à l'écran au chargement ne bouge pas (pas de
 *   "flash") ; seuls ceux plus bas apparaissent quand on les atteint.
 * - Les contenus chargés après coup (données Supabase) apparaissent en fondu.
 * - On ignore tout ce qui contient un élément "fixed" (modales) : une
 *   transformation casserait leur positionnement.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Titres de section : balayage de gauche à droite
const TITLES = "main h2[class*='font-black'], main h3[class*='font-black'][class*='text-3xl'], main h3[class*='font-black'][class*='text-4xl']";

const SELECTOR = [
  "main [data-reveal]",
  "main .grid > *",
  "main section:not(.ph):not(.hh)",
  "main article",
].join(",");

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.querySelector("main");
    if (!root) return;

    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        let i = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          if (el.classList.contains("acd-tt")) {
            el.classList.replace("acd-tt", "acd-tt-in");
            el.addEventListener("animationend", (ev) => { if (ev.target === el) el.classList.remove("acd-tt-in"); });
            continue;
          }
          el.style.setProperty("--rv-d", `${Math.min(i++, 5) * 70}ms`);
          el.classList.remove("acd-rv");
          el.classList.add("acd-rv-in");
          el.addEventListener("animationend", (ev) => { if (ev.target === el) el.classList.remove("acd-rv-in"); });
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    const scan = (initial: boolean) => {
      root.querySelectorAll<HTMLElement>(TITLES).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        if (el.closest(".ph, .hh, [data-no-reveal], .fixed")) return;
        const r = el.getBoundingClientRect();
        if (r.height === 0 || (initial && r.top < window.innerHeight * 0.92)) return;
        el.classList.add("acd-tt");
        io.observe(el);
      });
      root.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        // pas de cascade : on ne cible pas un élément déjà dans un bloc animé
        if (el.parentElement?.closest(".acd-rv, .acd-rv-in") && !el.matches(".grid > *")) return;
        if (el.closest(".ph, .hh, [data-no-reveal]") || el.querySelector(".fixed, [class*='fixed ']")) return;
        const r = el.getBoundingClientRect();
        if (r.height === 0) return;
        const inView = r.top < window.innerHeight * 0.92;
        if (initial && inView) return; // déjà visible : on n'y touche pas
        el.classList.add("acd-rv");
        io.observe(el);
      });
    };

    // laisse le temps à la page de se peindre avant le 1er passage
    const t = window.setTimeout(() => scan(true), 60);
    let pending = 0;
    const mo = new MutationObserver(() => {
      if (pending) return;
      pending = window.setTimeout(() => {
        pending = 0;
        scan(false);
      }, 80);
    });
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(t);
      window.clearTimeout(pending);
      mo.disconnect();
      io.disconnect();
      root.querySelectorAll(".acd-rv, .acd-tt").forEach((el) => el.classList.remove("acd-rv", "acd-tt"));
    };
  }, [pathname]);

  return null;
}
