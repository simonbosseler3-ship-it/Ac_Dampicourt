"use client";

import { ExternalLink, Calendar, Trophy, Info, MousePointer2, ArrowRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InscriptionsPage() {
  return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12 pt-32 pb-24 animate-in fade-in duration-1000">

          {/* HERO SECTION */}
          <div className="max-w-4xl mx-auto text-center mb-24">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-[2px] w-12 bg-red-600"></div>
              <span className="text-red-600 font-black uppercase italic tracking-[0.4em] text-[10px]">
              Espace Athlètes
            </span>
              <div className="h-[2px] w-12 bg-red-600"></div>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.85] mb-8">
              PRÊT POUR LA <br /><span className="text-red-600">COMPÉTITION ?</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase italic text-[11px] tracking-widest max-w-lg mx-auto leading-relaxed">
              Retrouvez toutes les plateformes de calendrier et les contacts pour vos inscriptions officielles.
            </p>
          </div>

          {/* SECTION PLATEFORMES (Haut) */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

            {/* PLATEFORME 1 : BEATHLETICS (LBFA) */}
            <div className="bg-slate-50 border border-slate-100 rounded-[3.5rem] p-10 md:p-14 hover:shadow-2xl hover:bg-white transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.07] transition-all duration-700 text-slate-900">
                <Calendar size={180} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="bg-red-600 p-5 rounded-2xl text-white shadow-xl shadow-red-200 group-hover:rotate-6 transition-transform">
                    <Calendar size={32} />
                  </div>
                  <span className="text-[9px] font-black bg-slate-900 text-white px-5 py-2 rounded-full uppercase tracking-[0.2em]">
                  Officiel LBFA
                </span>
                </div>

                <h2 className="text-4xl font-black text-slate-900 uppercase italic mb-6 leading-none tracking-tighter">
                  Calendrier <br /><span className="text-red-600 text-5xl">BeAthletics</span>
                </h2>
                <p className="text-slate-500 text-xs font-bold mb-12 leading-relaxed uppercase tracking-tight italic max-w-sm">
                  La plateforme centrale pour toutes les compétitions en Belgique. Consultez l'horaire et inscrivez-vous via votre portail athlète.
                </p>

                <a href="https://www.beathletics.be/calendar" target="_blank" rel="noopener noreferrer" className="block outline-none">
                  <Button className="w-full bg-slate-900 hover:bg-red-600 text-white font-black uppercase italic py-9 rounded-[1.5rem] shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-4 tracking-[0.2em] active:scale-95 border-none text-xs">
                    Ouvrir le calendrier <ExternalLink size={18} />
                  </Button>
                </a>
              </div>
            </div>

            {/* PLATEFORME 2 : ATHLETICS.APP */}
            <div className="bg-slate-50 border border-slate-100 rounded-[3.5rem] p-10 md:p-14 hover:shadow-2xl hover:bg-white transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.07] transition-all duration-700 text-blue-600">
                <MousePointer2 size={180} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-xl shadow-blue-200 group-hover:rotate-6 transition-transform">
                    <MousePointer2 size={32} />
                  </div>
                  <span className="text-[9px] font-black bg-slate-900 text-white px-5 py-2 rounded-full uppercase tracking-[0.2em]">
                  International
                </span>
                </div>

                <h2 className="text-4xl font-black text-slate-900 uppercase italic mb-6 leading-none tracking-tighter">
                  Plateforme <br /><span className="text-blue-600 text-5xl">Athletics.app</span>
                </h2>
                <p className="text-slate-500 text-xs font-bold mb-12 leading-relaxed uppercase tracking-tight italic max-w-sm">
                  Utilisée pour de nombreux meetings en Belgique et aux Pays-Bas. Idéal pour les compétitions hors province.
                </p>

                <a href="https://www.athletics.app/wedstrijden/" target="_blank" rel="noopener noreferrer" className="block outline-none">
                  <Button className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black uppercase italic py-9 rounded-[1.5rem] shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-4 tracking-[0.2em] active:scale-95 border-none text-xs">
                    Voir les meetings <ExternalLink size={18} />
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* SECTION RESPONSABLES (Bas) */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* CARTE 1 : CHAMPIONNATS (Bernard Thomas) */}
            <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between group">
              <Trophy className="absolute right-[-30px] bottom-[-30px] text-white/5 w-80 h-80 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 bg-red-600 px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] mb-10 shadow-xl shadow-red-900/40">
                  <Trophy size={14} /> Championnats
                </div>
                <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-6 leading-[0.9]">
                  Provinciaux <br /><span className="text-red-600">Luxembourg & LBFA</span>
                </h2>
                <p className="text-slate-400 text-[11px] font-bold mb-12 leading-relaxed uppercase tracking-widest italic max-w-xs">
                  Pour les championnats officiels, l'inscription est centralisée par le club.
                </p>

                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] group hover:border-red-600 transition-all duration-500">
                  <p className="text-[8px] font-black uppercase tracking-[0.4em] text-red-500 mb-2">Responsable Inscriptions</p>
                  <p className="text-3xl font-black uppercase italic tracking-tighter mb-4">Bernard Thomas</p>
                  <div className="flex items-center gap-3 text-[9px] font-black uppercase italic text-slate-400 group-hover:text-white transition-colors">
                    Contactez le via le club <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* CARTE 2 : FLA / LUXEMBOURG (Michel Rausch) */}
            <div className="bg-red-600 rounded-[3.5rem] p-10 md:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between group">
              <Flag className="absolute right-[-30px] bottom-[-30px] text-slate-900/10 w-80 h-80 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 bg-white text-slate-900 px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] mb-10 shadow-xl">
                  <Flag size={14} /> FLA (Luxembourg)
                </div>
                <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-6 leading-[0.9]">
                  Meetings <br /><span className="text-slate-900 text-3xl md:text-5xl italic font-black">Grand-Ducaux</span>
                </h2>
                <p className="text-red-100 text-[11px] font-bold mb-12 leading-relaxed uppercase tracking-widest italic max-w-xs">
                  Gestion des inscriptions pour les compétitions de la fédération luxembourgeoise.
                </p>

                <div className="bg-slate-900/10 backdrop-blur-2xl border border-slate-900/10 p-8 rounded-[2.5rem] group hover:bg-slate-900/20 transition-all duration-500">
                  <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-900 mb-2">Responsable Inscriptions</p>
                  <p className="text-3xl font-black uppercase italic tracking-tighter mb-4">Michel Rausch</p>
                  <div className="flex items-center gap-3 text-[9px] font-black uppercase italic text-red-100 group-hover:text-white transition-colors">
                    Contactez le via le club <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* INFO RAPPEL */}
          <div className="max-w-4xl mx-auto mt-24 bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row items-center gap-8 group hover:border-blue-600 transition-all duration-500">
            <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-xl shadow-blue-100 group-hover:scale-110 transition-transform">
              <Info size={28} />
            </div>
            <p className="text-slate-600 text-[10px] md:text-xs font-black uppercase tracking-[0.15em] leading-relaxed italic text-center md:text-left">
              IMPORTANT : Avant toute inscription, assurez-vous d'avoir un <span className="text-blue-600">dossard officiel valide</span> pour la saison en cours et d'être en règle de <span className="text-blue-600">cotisation</span>.
            </p>
          </div>
        </main>
      </div>
  );
}