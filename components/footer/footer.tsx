"use client";

import Link from "next/link";
import { MapPin, Instagram, Facebook, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
      <>
      {/* Fondu du fond de la page vers le footer (masqué sur les pages déjà sombres) */}
      <div className="acd-footer-fade" aria-hidden="true" />
      <footer className="relative overflow-hidden bg-slate-900 text-white">
        <div
            className="absolute inset-0 opacity-60 pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='208' viewBox='0 0 120 208'%3E%3Cpath d='M60 156l-60-34.6V51.4L60 16.8l60 34.6v69.9L60 156z' fill='none' stroke='%23ffffff' stroke-opacity='0.05' stroke-width='2'/%3E%3C/svg%3E\")",
              backgroundSize: "120px 208px",
              maskImage: "linear-gradient(to left, #000, transparent 75%)",
              WebkitMaskImage: "linear-gradient(to left, #000, transparent 75%)",
            }}
        />

        <div className="container mx-auto px-4 pt-14 pb-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-6">
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="text-red-600 font-black uppercase italic text-4xl leading-none">AC Dampicourt</h4>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Le club de la Gaume</p>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Former, s&apos;entraîner et performer. L&apos;athlétisme pour tous, de l&apos;initiation au haut niveau.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="text-white font-black uppercase italic text-sm tracking-widest">Navigation</h4>
              <nav className="flex flex-col gap-3">
                <Link href="/club" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all text-sm font-bold uppercase italic">Le Club</Link>
                <Link href="/actualites" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all text-sm font-bold uppercase italic">Actualités</Link>
                <a href="https://www.beathletics.be/calendar" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase italic inline-flex items-center gap-1">Calendrier <ArrowUpRight size={14} /></a>
                <a href="https://www.beathletics.be/results" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase italic inline-flex items-center gap-1">Résultats <ArrowUpRight size={14} /></a>
              </nav>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="text-white font-black uppercase italic text-sm tracking-widest">Le Stade</h4>
              <a
                  href="https://www.google.com/maps/search/?api=1&query=Rue+du+Stade+7+6762+Saint-Mard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-slate-400 text-sm group"
              >
                <MapPin size={20} className="text-red-600 shrink-0 mt-1" />
                <span>
                  <span className="block font-black text-white uppercase italic leading-none mb-1 group-hover:text-red-500 transition-colors">Piste Daniel Thiry</span>
                  Rue du Stade 7, 6762 SAINT-MARD
                </span>
              </a>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="text-white font-black uppercase italic text-sm tracking-widest">Suivre l&apos;ACD</h4>
              <div className="flex items-center gap-3">
                <a href="https://www.facebook.com/groups/111612989000083" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-blue-600 hover:border-blue-600 transition-all group">
                  <Facebook size={22} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://www.instagram.com/acdampicourt_" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 hover:border-transparent transition-all group">
                  <Instagram size={22} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Nom du club en grand, en filigrane, entièrement visible */}
          <svg className="acd-footer__big" viewBox="0 0 1000 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
              <linearGradient id="acd-footer-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.09" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* textLength : le texte remplit toujours exactement la largeur */}
            <text x="500" y="122" textAnchor="middle" textLength="990" lengthAdjust="spacingAndGlyphs">AC DAMPICOURT</text>
          </svg>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/10">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              © {new Date().getFullYear()} AC Dampicourt
            </div>
            <div className="flex gap-6 text-[9px] font-black uppercase text-slate-500 tracking-widest italic">
              <span>Confidentialité</span>
              <span>Règlement</span>
            </div>
          </div>
        </div>
      </footer>
      </>
  );
}
