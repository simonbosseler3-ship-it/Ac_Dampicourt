"use client";

import Link from "next/link";
import { MapPin, Phone, Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
      <footer className="bg-slate-900 text-white pt-20 pb-10 mt-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10 pb-16">
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="text-red-600 font-black uppercase italic text-3xl leading-none">AC Dampicourt</h4>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Le club de la Gaume</p>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Former, s'entraîner et performer. L'athlétisme pour tous, de l'initiation au haut niveau.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="text-white font-black uppercase italic text-sm tracking-widest">Navigation</h4>
              <nav className="flex flex-col gap-3">
                <Link href="/club" className="text-gray-400 hover:text-red-600 transition-colors text-sm font-bold uppercase italic">Le Club</Link>
                <Link href="/actualites" className="text-gray-400 hover:text-red-600 transition-colors text-sm font-bold uppercase italic">Actualités</Link>
                <Link href="/entrainement" className="text-gray-400 hover:text-red-600 transition-colors text-sm font-bold uppercase italic">Entraînements</Link>
                <Link href="/resultats" className="text-gray-400 hover:text-red-600 transition-colors text-sm font-bold uppercase italic">Résultats</Link>
              </nav>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="text-white font-black uppercase italic text-sm tracking-widest">Le Stade</h4>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin size={20} className="text-red-600 shrink-0 mt-1"/>
                  <div>
                    <p className="font-black text-white uppercase italic leading-none mb-1">Stade des Fusillés</p>
                    <p>Rue du Stade 7, 6762 SAINT-MARD</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone size={18} className="text-red-600 shrink-0"/>
                  <a href="tel:+3263576974" className="hover:text-white transition-colors font-bold">+32 63 57 69 74</a>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="text-white font-black uppercase italic text-sm tracking-widest">Suivre l'ACD</h4>
              <div className="flex items-center gap-4">
                <a href="https://www.facebook.com/groups/111612989000083" target="_blank" className="bg-white/5 p-4 rounded-2xl hover:bg-blue-600 transition-all group shadow-xl">
                  <Facebook size={22} className="group-hover:scale-110 transition-transform"/>
                </a>
                <a href="https://www.instagram.com/acdampicourt_" target="_blank" className="bg-white/5 p-4 rounded-2xl hover:bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 transition-all group shadow-xl">
                  <Instagram size={22} className="group-hover:scale-110 transition-transform"/>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-10">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
              © {new Date().getFullYear()} AC Dampicourt
            </div>
            <div className="flex gap-6 text-[9px] font-black uppercase text-gray-700 tracking-widest italic">
              <span>Confidentialité</span>
              <span>Réglement</span>
            </div>
          </div>
        </div>
      </footer>
  );
}