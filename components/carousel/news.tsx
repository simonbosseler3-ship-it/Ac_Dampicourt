"use client";

/**
 * Carrousel "À la une" de l'accueil, en plein écran sous la navbar.
 * - Les 3 dernières actualités en fondu enchaîné, zoom lent sur la photo.
 * - En haut à droite : barre de progression + titre de chaque actu.
 *   La progression est pilotée en JS (requestAnimationFrame) : elle avance
 *   toujours, se met en pause avec le bouton pause ou quand l'onglet est caché.
 *   (Avant, survoler le carrousel le mettait en pause : comme il occupe tout
 *   l'écran, la barre semblait bloquée.)
 * - Le bas des photos se fond progressivement dans le fond du site.
 * - Flèches, glisser au doigt, clavier ← →, décorations Noël / Pâques conservées.
 */

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeContext";

interface NewsItem {
  id: string;
  title: string;
  date_text: string;
  image_url: string;
}

const DELAY = 7000;

export function HeroNews({ newsData }: { newsData: NewsItem[] }) {
  const { theme } = useTheme();
  const slides = (newsData || []).slice(0, 3);
  const count = slides.length;
  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  const touchX = React.useRef<number | null>(null);
  const bars = React.useRef<(HTMLElement | null)[]>([]);
  const mbars = React.useRef<(HTMLElement | null)[]>([]);
  const elapsed = React.useRef(0);

  const go = React.useCallback((i: number) => {
    if (!count) return;
    elapsed.current = 0;
    setIndex(((i % count) + count) % count);
  }, [count]);

  // Boucle de progression
  React.useEffect(() => {
    if (count < 2) return;
    let raf = 0;
    let last = performance.now();
    const paint = (v: number) => {
      bars.current.forEach((b, i) => { if (b) b.style.transform = `scaleX(${i === index ? v : i < index ? 1 : 0})`; });
      mbars.current.forEach((b, i) => { if (b) b.style.transform = `scaleX(${i === index ? v : i < index ? 1 : 0})`; });
    };
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100); // évite un saut au retour sur l'onglet
      last = now;
      if (playing) elapsed.current += dt;
      const v = Math.min(elapsed.current / DELAY, 1);
      paint(v);
      if (v >= 1) { go(index + 1); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, playing, count, go]);

  if (!count) return null;
  const current = slides[index];
  const fmt = (d: string) => {
    const date = new Date(d);
    return isNaN(date.getTime()) ? d : date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
      <section
          className="hh"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(index + 1);
            if (e.key === "ArrowLeft") go(index - 1);
          }}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
            touchX.current = null;
          }}
          aria-roledescription="carrousel"
          aria-label="Actualités à la une"
      >
        {/* --- PHOTOS (se fondent dans le fond du site en bas) --- */}
        <div className="hh__media" aria-hidden="true">
          {slides.map((item, i) => (
              <div key={item.id} className="hh__slide" data-on={i === index ? "" : undefined}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url} alt="" loading={i === 0 ? "eager" : "lazy"} style={{ objectPosition: "center 35%" }} />
              </div>
          ))}
          <div className="hh__shade" />
          <div className="hh__hex" />
        </div>

        {/* --- DÉCORATIONS SAISONNIÈRES --- */}
        {theme === "christmas" && (
            <>
              <div className="hh__deco animate-holly-left" style={{ top: "4.5rem", left: "-2rem", width: "clamp(8rem, 18vw, 18rem)" }}><img src="/holly.png" alt="" /></div>
              <div className="hh__deco animate-holly-right" style={{ top: "4.5rem", right: "-2rem", width: "clamp(8rem, 18vw, 18rem)", transform: "scaleX(-1)" }}><img src="/holly.png" alt="" /></div>
            </>
        )}
        {theme === "easter" && (
            <>
              <div className="hh__deco animate-bunny" style={{ top: "5rem", left: "-1rem", width: "clamp(7rem, 15vw, 15rem)" }}><img src="/lapin.png" alt="" /></div>
              <div className="hh__deco animate-flower-right" style={{ bottom: "6rem", right: "-1rem", width: "clamp(6rem, 12vw, 12rem)", transformOrigin: "bottom right" }}><img src="/fleur.png" alt="" /></div>
            </>
        )}
        <style>{`
          @keyframes holly-float { 0%, 100% { translate: 0 0; rotate: 0deg; } 50% { translate: 0 -10px; rotate: -3deg; } }
          @keyframes bunny-peek { 0%, 100% { translate: 0 0; } 50% { translate: -15px 0; rotate: -2deg; } }
          @keyframes flower-sway-right { 0%, 100% { rotate: -20deg; } 50% { rotate: -12deg; scale: 1.05; } }
          .animate-holly-left { animation: holly-float 6s ease-in-out infinite; }
          .animate-holly-right { animation: holly-float 6s ease-in-out infinite reverse; }
          .animate-bunny { animation: bunny-peek 5s ease-in-out infinite; }
          .animate-flower-right { animation: flower-sway-right 4s ease-in-out infinite; }
        `}</style>

        {/* --- NAVIGATION (desktop) : progression + titres --- */}
        {count > 1 && (
            <div className="hh__nav">
              <div className="container mx-auto px-4 hh__dots">
                {slides.map((item, i) => (
                    <button key={item.id} type="button" className="hh__dot" aria-current={i === index} onClick={() => go(i)} aria-label={`Afficher : ${item.title}`}>
                      <span className="hh__bar"><i ref={(el) => { bars.current[i] = el; }} style={{ transform: `scaleX(${i < index ? 1 : 0})` }} /></span>
                      <span>{item.title}</span>
                    </button>
                ))}
              </div>
            </div>
        )}

        {/* --- CONTENU DE L'ACTU ACTIVE --- */}
        <div className="hh__content">
          <div className="container mx-auto px-4">
            <div className="hh__text" key={current.id} aria-live="polite">
              <span className="hh__tag"><i />À la une</span>
              <h2 className="hh__title">{current.title}</h2>
              <div className="hh__foot">
                <p className="hh__date">{fmt(current.date_text)}</p>
                <Link href={`/actualites/${current.id}`} className="hh__cta">Lire la suite <ArrowRight /></Link>
              </div>
              {count > 1 && (
                  <div className="hh__mdots">
                    {slides.map((item, i) => (
                        <button key={item.id} type="button" aria-current={i === index} aria-label={`Actualité ${i + 1}`} onClick={() => go(i)}>
                          <i ref={(el) => { mbars.current[i] = el; }} style={{ transform: `scaleX(${i < index ? 1 : 0})` }} />
                        </button>
                    ))}
                  </div>
              )}
            </div>
          </div>
        </div>

        {count > 1 && (
            <div className="hh__arrows">
              <div className="container mx-auto px-4">
                <button type="button" className="hh__arrow" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Mettre en pause" : "Reprendre le défilement"}>
                  {playing ? <Pause /> : <Play />}
                </button>
                <button type="button" className="hh__arrow" onClick={() => go(index - 1)} aria-label="Actualité précédente"><ChevronLeft /></button>
                <button type="button" className="hh__arrow" onClick={() => go(index + 1)} aria-label="Actualité suivante"><ChevronRight /></button>
              </div>
            </div>
        )}
      </section>
  );
}
